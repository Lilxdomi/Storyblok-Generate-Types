//@ts-nocheck
import {compile} from 'json-schema-to-typescript'
import fs from 'fs'
import path from 'path'
import StoryblokClient from 'storyblok-js-client'
import {getConfig} from './generate'
import camelCase from './camelCase'
import {generateCustomComponents} from './generateCustomComponents'

const tsString: string[] = []
const referenceTypes: string[] = []
const groupUuids = {}
export const getTitle = (t: string) => 'SB' + t
const getEnumName = (key: string) =>
  `${camelCase(key, {
    pascalCase: true,
  })}Enum`
const suffixEnum = (name: string) => {
  const number = name.split('_')?.[1]
  const parsedNumber = number && parseInt(number)

  if (parsedNumber) {
    return name + `_${parsedNumber + 1}`
  } else {
    return name + '_1'
  }
}
const cachedDatabaseResults = {}

export async function handlerFunction(): Promise<Boolean> {
  const config = getConfig()
  if (!config) {
    console.error('Config not initialized.')
    return false
  }

  const Storyblok = new StoryblokClient({
    accessToken: config.apiKey,
    cache: {
      clear: 'auto',
      type: 'memory',
    },
  })

  const pathToTsFile = config.pathToGeneratedTsFile || './generated.ts'

  const componentsJson = JSON.parse(fs.readFileSync(`${__dirname}/json/components.${config.spaceId}.json`, 'utf8'))

  for (const value of componentsJson.components) {
    if (value.component_group_uuid) {
      if (!groupUuids[value.component_group_uuid]) {
        groupUuids[value.component_group_uuid] = []
      }

      groupUuids[value.component_group_uuid].push(
        getTitle(
          camelCase(value.name, {
            pascalCase: true,
          }),
        ),
      )
    }
  }

  genTsSchema().then(() => {
    try {
      const outputDir = path.dirname(pathToTsFile)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true})
      }
      fs.writeFileSync(pathToTsFile, tsString.join('\n'))
      console.info('Finished generating types')
    } catch (e) {
      console.error('Error creating the file on your system')
      console.error(e)
    }
  })

  async function genTsSchema() {
    tsString.push('/* eslint-disable no-unused-vars */')
    await genExportComponentFile()
    await genFixedTsSchema()
    for (const values of componentsJson.components) {
      let obj: {[key: string]: any} = {}
      let isContentType = false
      obj = initialObject(values, true, false)
      const {enums, parseObj} = await typeMapper(values.schema)
      if (referenceTypes.includes(values.name)) {
        isContentType = true
      }

      obj.properties = parseObj
      obj.properties.component = {
        enum: [values.name],
        type: 'string',
      }
      if (!isContentType) {
        obj.properties._uid = {
          type: 'string',
        }
      }

      if (enums && Object.keys(enums)?.length) {
        await generateEnums(enums)
      }

      try {
        const ts = await compile(obj, values.name, {
          bannerComment: '',
          unknownAny: false,
        }) // unknownAny: false to remove unknown type and enable build
        tsString.push(ts)
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function genExportComponentFile() {
    for (const values of componentsJson.components) {
      if (!values.is_root || !!values.is_nestable || !!values.component_group_name?.toLowerCase().includes('component'))
        continue

      try {
        referenceTypes.push(values.name)
      } catch (error) {
        console.error('genExportComponentFile failed', error)
      }
    }
  }

  async function genFixedTsSchema() {
    const customComponentsJson = await generateCustomComponents(referenceTypes)
    for (const values of customComponentsJson.components) {
      if (!values) continue
      let obj: {[key: string]: any} = {}
      obj = initialObject(values)
      const {enums, parseObj} = await typeMapper(values.schema)
      obj.properties = parseObj
      if (enums && Object.keys(enums)?.length) {
        await generateEnums(enums)
      }

      try {
        const ts = await compile(obj, values.name, {
          bannerComment: '',
          unknownAny: false,
        })
        tsString.push(ts)
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function typeMapper(schema: {[key: string]: any} = {}): Promise<{enums: any; parseObj: any}> {
    const parseObj: {[key: string]: any} = {}
    const enums: {[key: string]: any} = {}
    const keys = Object.keys(schema)

    const cacheVersion = Date.now()

    for (let i = 0; i < keys?.length; i++) {
      const key = keys[i]
      const obj: {[key: string]: any} = {}
      const schemaElement = schema[key]
      const {type, schema: elementSchema, required} = schemaElement

      // Custom resolves for special SB types
      switch (type) {
        case 'storyContent': {
          Object.assign(parseObj, {
            [key]: {
              tsType: schemaElement.tsType,
            },
          })
          break
        }

        case 'custom': {
          Object.assign(parseObj, customTypeParser(key, schemaElement))
          break
        }

        case 'multilink': {
          Object.assign(parseObj, {[key]: {tsType: 'SBLink'}})
          break
        }

        case 'asset': {
          Object.assign(parseObj, {[key]: {tsType: 'SBAssetFile'}})
          break
        }

        case 'multiasset': {
          Object.assign(parseObj, {[key]: {tsType: 'SBAssetFile[]'}})
          break
        }

        case 'richtext': {
          Object.assign(parseObj, {[key]: {tsType: 'SBRichtext'}})
          break
        }

        case 'datetime': {
          Object.assign(parseObj, {[key]: {tsType: 'Date'}})
          break
        }

        case 'enum': {
          const items = schemaElement.enum
          Object.assign(parseObj, {[key]: {tsType: getEnumName(key)}})
          enums[key] = items
          break
        }

        case 'option': {
          if (schemaElement.filter_content_type) {
            Object.assign(parseObj, {[key]: {tsType: getOptionsTypes(schemaElement.filter_content_type, true)}})
          } else {
            if (!!schemaElement.datasource_slug) {
              const databaseEntries = await getDatabaseEntries(schemaElement, cacheVersion, 'string')
              Object.assign(parseObj, {[key]: {tsType: getEnumName(schemaElement.datasource_slug)}})
              enums[schemaElement.datasource_slug] = databaseEntries
            } else {
              Object.assign(parseObj, {[key]: {tsType: getEnumName(key)}})
              enums[key] = schemaElement.options?.map((item) => item.value)
            }
          }
          break
        }

        case 'options': {
          if (schemaElement.filter_content_type) {
            Object.assign(parseObj, {[key]: {tsType: getOptionsTypes(schemaElement.filter_content_type, false)}})
          } else {
            if (!!schemaElement.datasource_slug) {
              const databaseEntries = await getDatabaseEntries(schemaElement, cacheVersion, 'string')
              Object.assign(parseObj, {[key]: {tsType: `${getEnumName(schemaElement.datasource_slug)}[]`}})
              enums[schemaElement.datasource_slug] = databaseEntries
            } else {
              Object.assign(parseObj, {[key]: {tsType: `${getEnumName(key)}[]`}})
              enums[key] = schemaElement.options?.map((item) => item.value)
            }
          }
          break
        }

        case 'customArray': {
          if (schemaElement?.items?.tsType) {
            Object.assign(parseObj, {
              [key]: {
                tsType: `Array<${schemaElement.items.tsType}>`,
              },
            })
            return {enums, parseObj}
          }

          Object.assign(parseObj, {
            [key]: {
              tsType: 'Array<unknown>',
            },
          })
          return {enums, parseObj}
        }

        default: {
          break
        }
      }

      const schemaType = parseType(type)
      if (!schemaType) {
        continue
      }

      obj[key] = {
        type: schemaType,
      }

      if (elementSchema) {
        obj[key].properties = elementSchema
      }

      if (required) {
        obj[key].required = required
      }

      if (schemaElement.allOf) {
        obj[key].allOf = schemaElement.allOf
      }
      if (schemaElement.anyOf) {
        obj[key].anyOf = schemaElement.anyOf
      }
      if (schemaElement.oneOf) {
        obj[key].oneOf = schemaElement.oneOf
      }
      if (schemaElement.datasource_slug) {
        obj[key].enum = await getDatabaseEntries(schemaElement, cacheVersion, schemaType)
      }

      if (type === 'bloks' && schemaElement.restrict_components) {
        obj[key].tsType = getRestrictedComponents(schemaElement)
      }

      Object.assign(parseObj, obj)
    }

    return {enums, parseObj}
  }

  async function getDatabaseEntries(schemaElement, cacheVersion, schemaType) {
    let items = []
    if (Object.keys(cachedDatabaseResults).includes(schemaElement.datasource_slug)) {
      items = cachedDatabaseResults[`${schemaElement.datasource_slug}`]
    } else {
      try {
        const result = await Storyblok.get('cdn/datasource_entries', {
          // the cacheVersion is created on every script run
          cv: cacheVersion,
          datasource: schemaElement.datasource_slug,
          page: 1,
          // ignore the cache, in case of datasource changes
          // the cache bloks the usability of the script
          per_page: 100,
        })

        if (result.data.datasource_entries?.length) {
          items = result.data.datasource_entries.map((item) => item.value)
        }
      } catch (error) {
        console.error('get CDN Failed', JSON.stringify(error))
        items = []
      }

      cachedDatabaseResults[`${schemaElement.datasource_slug}`] = items
    }

    if (schemaType === 'string') {
      return items
    }

    return {
      enum: items,
    }
  }

  return true
}

const getOptionsTypes = (types, single?: boolean) => {
  let str = ''
  if (types.length === 0) {
    return str
  }

  if (typeof types === 'string') {
    return `{content: SB${camelCase(types, {
      pascalCase: true,
    })}}`
  }

  for (const [i, type] of types.entries()) {
    str += `${i === 0 ? '' : '|'} SB${camelCase(type, {
      pascalCase: true,
    })}`
  }

  return single ? str : `${str}[]`
}

const alreadyGeneratedEnums: string[] = []
const usedEnums: string[] = []
async function generateEnums(enums) {
  const objKeys = Object.keys(enums)
  if (objKeys?.length) {
    for (const key of objKeys) {
      if (alreadyGeneratedEnums.includes(key)) continue
      let parsedKeyName = getEnumName(key)

      while (usedEnums.includes(parsedKeyName)) {
        parsedKeyName = suffixEnum(parsedKeyName)
      }
      const enumStrings = enums[key]
      if (!enumStrings?.length) continue
      const parsedNames = enumStrings.map((item) =>
        camelCase(item, {
          pascalCase: true,
        }),
      )
      const obj = {
        enum: enumStrings,
        tsEnumNames: parsedNames,
        type: 'string',
      }

      try {
        const ts = await compile(obj, parsedKeyName, {
          bannerComment: '',
          unknownAny: false,
        })
        tsString.push(ts)
        alreadyGeneratedEnums.push(key)
        usedEnums.push(parsedKeyName)
      } catch (error) {
        console.error(error)
      }
    }
  }
}

function initialObject(values, sbTitle?: boolean, addHardcodedProps?: boolean) {
  const obj: {[key: string]: any} = {}

  if (!values) return obj
  obj.title = sbTitle
    ? getTitle(
        camelCase(values.name, {
          pascalCase: true,
        }),
      )
    : values.name

  obj.id = values.name
  obj.type = 'object'

  if (values.allOf) {
    obj.allOf = values.allOf
  }

  if (values.anyOf) {
    obj.anyOf = values.anyOf
  }

  if (values.oneOf) {
    obj.oneOf = values.oneOf
  }

  const requiredFields = addHardcodedProps ? ['_uid', 'component'] : []
  if (values.schema) {
    for (const key of Object.keys(values.schema)) {
      if (values.schema[key].required) {
        requiredFields.push(key)
      }
    }

    if (requiredFields.length > 0) {
      obj.required = requiredFields
    }
  }

  return obj
}

function getRestrictedComponents(schemaElement) {
  if (schemaElement.restrict_type === 'groups') {
    if (Array.isArray(schemaElement.component_group_whitelist) && schemaElement.component_group_whitelist?.length) {
      let currentGroupElements = []
      for (const groupId of schemaElement.component_group_whitelist) {
        const currentGroup = groupUuids[groupId]
        if (Array.isArray(currentGroup)) {
          currentGroupElements = [...currentGroupElements, ...currentGroup]
        } else {
          console.warn('Group has no members:', groupId)
        }
      }

      return `(${currentGroupElements.join(' | ')})[]`
    }
  } else {
    if (Array.isArray(schemaElement.component_whitelist) && schemaElement.component_whitelist?.length) {
      return `(${schemaElement.component_whitelist
        .map((i) =>
          getTitle(
            camelCase(i, {
              pascalCase: true,
            }),
          ),
        )
        .join(' | ')})[]`
    }

    console.warn('No whitelisted component found')
  }
}

function parseType(type: string) {
  switch (type) {
    case 'text': {
      return 'string'
    }

    case 'bloks': {
      return 'array'
    }

    case 'number': {
      return 'number'
    }

    case 'image': {
      return 'string'
    }

    case 'boolean': {
      return 'boolean'
    }

    case 'textarea': {
      return 'string'
    }

    case 'markdown': {
      return 'string'
    }

    // customComponent helper
    case 'customArray': {
      return 'customArray'
    }

    case 'customObject': {
      return 'customObject'
    }

    case 'object': {
      return 'object'
    }

    default: {
      return null
    }
  }
}

function customTypeParser(key, obj) {
  switch (obj.field_type) {
    case 'seo-metatags': {
      return {
        [key]: {
          tsType: 'SBSeo',
        },
      }
    }

    case 'table': {
      return {
        [key]: {
          properties: {
            tbody: {
              type: 'array',
            },
            thead: {
              type: 'array',
            },
          },
          type: 'object',
        },
      }
    }

    default: {
      return {}
    }
  }
}
