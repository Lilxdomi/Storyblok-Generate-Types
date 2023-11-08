import fs from 'fs'

export function generateCustomComponents(allFiles: string[]): Promise<JSON> {
  const customComponentsJson = JSON.parse(fs.readFileSync(`${__dirname}/json/customComponents.json`, 'utf8'))

  const components = customComponentsJson.components
  const parsedStrings = allFiles.map((item) => ({$ref: `${__dirname}/json/extend/${item}.json`}))
  customComponentsJson.components = components.map((item: {[key: string]: any}) => {
    if (item.name === 'SBStory') {
      item.allOf = parsedStrings
      return item
    } else {
      return item
    }
  })

  return customComponentsJson
}
