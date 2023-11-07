import fs from 'fs'
import {exec} from 'child_process'

export interface Config {
  apiKey: string
  pathToGeneratedTsFile: string
  spaceId: string
}

export function getConfig(): Config | null {
  try {
    const data = fs.readFileSync(`${__dirname}/generateTypesConfig.json`, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading config file:', error)
    return null
  }
}

export async function generate() {
  const config = getConfig()
  if (!config?.spaceId) {
    console.error('SpaceId not initialized. Call init() with the configuration first.')
  }

  const pullCommand = `cd ${__dirname}/json && storyblok pull-components --space=${config?.spaceId}`

  exec(pullCommand, (error, _, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }

    if (stderr) {
      console.error(`Command execution failed: ${stderr}`)
      return
    }

    console.log('Pulled components successfully')
  })
}
