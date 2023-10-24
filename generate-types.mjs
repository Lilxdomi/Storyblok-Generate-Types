import {compile} from 'json-schema-to-typescript';
import StoryblokClient from 'storyblok-js-client';
import camelcase from 'camelcase';
import fs from 'fs';
import {getConfig} from './src/index';

const config = getConfig();



const pathToTsFile = config.pathToGeneratedTsFile;
// path to generated export component file
const pathToExportComponentsFile = './json/exportComponents.json';
const pathToExtendFiles = './json/extend';

//change the number in a new project (is the spaceID from storyblok) also change in package.json!
import componentsJson from `./json/components.${config.spaceId}.json` assert {type: 'json'};
import customComponentsJson from './json/customComponents.json' assert {type: 'json'};
import exportTypes from './json/exportComponents.json' assert {type: 'json'};

let tsString = [];
const groupUuids = {};
const getTitle = (t) => 'SB' + t;
const getEnumName = (key) =>
  `${camelcase(key, {
    pascalCase: true,
  })}Enum`;
let cachedDatabaseResults = {};

//Change the accessToken in a new project
const Storyblok = new StoryblokClient({
  accessToken: config.apiKey,
  cache: {
    clear: 'auto',
    type: 'memory',
  },
});

const getOptionsTypes = (types, single) => {
  let str = '';
  if (types.length === 0) {
    return str;
  }
  if (typeof types === 'string') {
    return `{content: SB${camelcase(types, {
      pascalCase: true,
    })}}`;
  }
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    str += `${i !== 0 ? '|' : ''} SB${camelcase(type, {
      pascalCase: true,
    })}`;
  }
  return single ? str : `${str}[]`;
};

componentsJson.components.forEach((value) => {
  if (value.component_group_uuid) {
    if (!groupUuids[value.component_group_uuid]) {
      groupUuids[value.component_group_uuid] = [];
    }
    groupUuids[value.component_group_uuid].push(
      getTitle(
        camelcase(value.name, {
          pascalCase: true,
        })
      )
    );
  }
});

async function genTsSchema() {
  await genExportComponentFile();
  await genExportTypes();
  await genFixedTsSchema();
  for (const values of componentsJson.components) {
    let obj = {};
    obj = initialObject(values, true, false);

    const {parseObj, enums} = await typeMapper(values.schema);
    obj.properties = parseObj;
    obj.properties._uid = {
      type: 'string',
    };
    obj.properties.component = {
      type: 'string',
      enum: [values.name],
    };

    if (enums && Object.keys(enums)?.length) {
      await generateEnums(enums);
    }
    try {
      const ts = await compile(obj, values.name, {
        bannerComment: '',
        unknownAny: false,
      }); // unknownAny: false to remove unknown type and enable build
      tsString.push(ts);
    } catch (e) {
      console.error(e);
    }
  }
}

async function genExportComponentFile() {
  const exportComponents = [];
  for (const values of componentsJson.components) {
    if (!values.is_root) continue;
    try {
      exportComponents.push(JSON.stringify(values));
    } catch (e) {
      console.error('genExportComponentFile failed', e);
    }
  }
  fs.writeFileSync(pathToExportComponentsFile, `{"components": [${exportComponents.join(',')}]}`);
}

async function genExportTypes() {
  for (const values of exportTypes.components) {
    let obj = {};
    obj = initialObject(values);

    const {parseObj, enums} = await typeMapper(values.schema);
    obj.properties = parseObj;
    if (enums && Object.keys(enums)?.length) {
      await generateEnums(enums);
    }
    try {
      fs.writeFileSync(`${pathToExtendFiles}/${values.name}.json`, `${JSON.stringify(obj)}`);
    } catch (e) {
      console.error('error writing the genExportTypes file', e);
    }
  }
}

async function genFixedTsSchema() {
  for (const values of customComponentsJson.components) {
    let obj = {};
    obj = initialObject(values);

    const {parseObj, enums} = await typeMapper(values.schema);
    obj.properties = parseObj;
    if (enums && Object.keys(enums)?.length) {
      await generateEnums(enums);
    }
    try {
      const ts = await compile(obj, values.name, {
        bannerComment: '',
        unknownAny: false,
      });
      tsString.push(ts);
    } catch (e) {
      console.error(e);
    }
  }
}

async function typeMapper(schema = {}) {
  const parseObj = {};
  const enums = {};
  const keys = Object.keys(schema);

  const cacheVersion = new Date().valueOf();

  for (let i = 0; i < keys?.length; i++) {
    const key = keys[i];
    const obj = {};
    const schemaElement = schema[key];
    const type = schemaElement.type;

    //Custom resolves for special SB types
    switch (type) {
      case 'custom':
        Object.assign(parseObj, customTypeParser(key, schemaElement));
        break;
      case 'multilink':
        Object.assign(parseObj, {[key]: {tsType: 'SBLink'}});
        break;
      case 'asset':
        Object.assign(parseObj, {[key]: {tsType: 'SBAssetFile'}});
        break;
      case 'multiasset':
        Object.assign(parseObj, {[key]: {tsType: 'SBAssetFile[]'}});
        break;
      case 'richtext':
        Object.assign(parseObj, {[key]: {tsType: 'SBRichtext'}});
        break;
      case 'datetime':
        Object.assign(parseObj, {[key]: {tsType: 'Date'}});
        break;
      case 'enum':
        const items = schemaElement.enum;
        Object.assign(parseObj, {[key]: {tsType: getEnumName(key)}});
        enums[key] = items;
        break;
      case 'option':
        if (schemaElement.filter_content_type) {
          Object.assign(parseObj, {[key]: {tsType: getOptionsTypes(schemaElement.filter_content_type, true)}});
        } else {
          Object.assign(parseObj, {[key]: {tsType: getEnumName(key)}});
          enums[key] = schemaElement.options?.map((item) => item.value);
        }
        break;
      case 'options':
        if (schemaElement.filter_content_type) {
          Object.assign(parseObj, {[key]: {tsType: getOptionsTypes(schemaElement.filter_content_type, false)}});
        } else {
          Object.assign(parseObj, {[key]: {tsType: `${getEnumName(key)}[]`}});
          enums[key] = schemaElement.options?.map((item) => item.value);
        }
        break;
      case 'customArray':
        if (schemaElement?.items?.tsType) {
          Object.assign(parseObj, {
            [key]: {
              tsType: `Array<${schemaElement.items.tsType}>`,
            },
          });
          return parseObj;
        } else {
          Object.assign(parseObj, {
            [key]: {
              tsType: 'Array<unknown>',
            },
          });
          return parseObj;
        }
      default:
        break;
    }

    const schemaType = parseType(type);
    if (!schemaType) {
      continue;
    }
    obj[key] = {
      type: schemaType,
    };

    if (schemaElement.allOf) {
      obj[key].allOf = schemaElement.allOf;
    }
    if (schemaElement.datasource_slug) {
      obj[key].enum = await getDatabaseEntries(schemaElement, cacheVersion, schemaType);
    }
    if (type === 'bloks' && schemaElement.restrict_components) {
      obj[key].tsType = getRestrictedComponents(schemaElement);
    }

    Object.assign(parseObj, obj);
  }
  return {parseObj, enums};
}

const alreadyGeneratedEnums = [];
async function generateEnums(enums) {
  const objKeys = Object.keys(enums);
  if (objKeys?.length) {
    for (let index = 0; index < objKeys.length; index++) {
      const key = objKeys[index];
      if (alreadyGeneratedEnums.includes(key)) continue;
      const parsedKeyName = getEnumName(key);
      const enumStrings = enums[key];
      const parsedNames = enumStrings.map((item) =>
        camelcase(item, {
          pascalCase: true,
        })
      );
      const obj = {
        type: 'string',
        enum: enumStrings,
        tsEnumNames: parsedNames,
      };
      try {
        const ts = await compile(obj, parsedKeyName, {
          bannerComment: '',
          unknownAny: false,
        });
        tsString.push(ts);
        alreadyGeneratedEnums.push(key);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

function initialObject(values, sbTitle, addHardcodedProps) {
  const obj = {};
  if (sbTitle) {
    obj.title = getTitle(
      camelcase(values.name, {
        pascalCase: true,
      })
    );
  } else {
    obj.title = values.name;
  }
  obj.id = values.name;
  obj.type = 'object';

  if (values.allOf) {
    obj.allOf = values.allOf;
  }

  const requiredFields = addHardcodedProps ? ['_uid', 'component'] : [];
  if (values.schema) {
    Object.keys(values.schema).forEach((key) => {
      if (values.schema[key].required) {
        requiredFields.push(key);
      }
    });
    if (requiredFields.length) {
      obj.required = requiredFields;
    }
  }
  return obj;
}

async function getDatabaseEntries(schemaElement, cacheVersion, schemaType) {
  let items = [];
  if (!Object.keys(cachedDatabaseResults).includes(schemaElement.datasource_slug)) {
    try {
      const result = await Storyblok.get('cdn/datasource_entries', {
        datasource: schemaElement.datasource_slug,
        per_page: 100,
        //ignore the cache, in case of datasource changes
        //the cache bloks the usability of the script
        //the cacheVersion is created on every script run
        cv: cacheVersion,
      });
      items = result.data.datasource_entries.map((item) => item.value);
    } catch (error) {
      console.error('get CDN Failed', JSON.stringify(error));
      items = undefined;
    }
    cachedDatabaseResults[`${schemaElement.datasource_slug}`] = items;
  } else {
    items = cachedDatabaseResults[`${schemaElement.datasource_slug}`];
  }
  if (schemaType === 'string') {
    return items;
  } else {
    return {
      enum: items,
    };
  }
}

function getRestrictedComponents(schemaElement) {
  if (schemaElement.restrict_type === 'groups') {
    if (Array.isArray(schemaElement.component_group_whitelist) && schemaElement.component_group_whitelist?.length) {
      let currentGroupElements = [];
      schemaElement.component_group_whitelist.forEach((groupId) => {
        const currentGroup = groupUuids[groupId];
        if (Array.isArray(currentGroup)) {
          currentGroupElements = [...currentGroupElements, ...currentGroup];
        } else {
          console.warn('Group has no members: ', groupId);
        }
      });
      return `(${currentGroupElements.join(' | ')})[]`;
    }
  } else {
    if (Array.isArray(schemaElement.component_whitelist) && schemaElement.component_whitelist?.length) {
      return `(${schemaElement.component_whitelist
        .map((i) =>
          getTitle(
            camelcase(i, {
              pascalCase: true,
            })
          )
        )
        .join(' | ')})[]`;
    } else {
      console.warn('No whitelisted component found');
    }
  }
}

function parseType(type) {
  switch (type) {
    case 'text':
      return 'string';
    case 'bloks':
      return 'array';
    case 'number':
      return 'number';
    case 'image':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'textarea':
      return 'string';
    case 'markdown':
      return 'string';
    // customComponent helper
    case 'customArray':
      return 'customArray';
    case 'object':
      return 'object';
    default:
      return null;
  }
}

function customTypeParser(key, obj) {
  switch (obj.field_type) {
    case 'seo-metatags':
      return {
        [key]: {
          tsType: 'SBSeo',
        },
      };
    case 'table':
      return {
        [key]: {
          type: 'object',
          properties: {
            tbody: {
              type: 'array',
            },
            thead: {
              type: 'array',
            },
          },
        },
      };
    default:
      return {};
  }
}

genTsSchema().then(() => {
  fs.writeFileSync(pathToTsFile, tsString.join('\n'));
});
