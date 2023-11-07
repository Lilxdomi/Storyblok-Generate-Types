import fs from 'fs'

export function generateCustomComponents(): Promise<JSON> {
  const customComponentsJson = JSON.parse(fs.readFileSync(`${__dirname}/json/customComponents.json`, 'utf8'))

  const components = customComponentsJson.components

  customComponentsJson.components = components.map((item: {[key: string]: any}) => {
    if (item.name === 'SBStory') {
      item.allOf = [{$ref: `${__dirname}/json/extend/page.json`}]
    } else {
      return item
    }
  })

  return customComponentsJson
}
