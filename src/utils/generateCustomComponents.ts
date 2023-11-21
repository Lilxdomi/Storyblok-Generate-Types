import fs from 'fs'
import camelCase from './camelCase'
import {getTitle} from './generate-types'

export function generateCustomComponents(allFiles: string[]): Promise<JSON> {
  const customComponentsJson = JSON.parse(fs.readFileSync(`${__dirname}/json/customComponents.json`, 'utf8'))

  const components = customComponentsJson.components
  const parsedTitles = allFiles.map((item) =>
    getTitle(
      camelCase(item, {
        pascalCase: true,
      }),
    ),
  )

  customComponentsJson.components = components.map((item: {[key: string]: any}) => {
    if (item.name === 'SBStory') {
      const content = item.schema.content

      content.tsType = `(${parsedTitles.join(' | ')}) & {
        component: ${allFiles.map((item) => `"${item}"`).join(' | ')}; 
        _uid: string; 
        _editable: string
      }`
      return item
    } else {
      return item
    }
  })
  return customComponentsJson
}
