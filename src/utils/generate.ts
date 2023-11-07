import fs from 'fs'
import {exec} from 'child_process'
import {handlerFunction} from './generate-types'
import {stdout} from 'process'

export interface Config {
  apiKey: string
  pathToGeneratedTsFile: string
  spaceId: string
}

export function getConfig(): Config | null {
  try {
    const data = fs.readFileSync(`${__dirname}/generateTypesConfig.json`, 'utf8')
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error('Create the generateTypesConfig.json in your root first. Read the docs for more information.')
    } else {
      console.error('Error reading config file:')
    }

    return null
  }
}

export async function generate() {
  const config = getConfig()
  if (!config) {
    return null
  }
  if (!config?.spaceId || !config.apiKey) {
    console.error('Required props missing in the config. Add them first, check the docs for more information.')
    return null
  }

  const pullCommand = `cd ${__dirname}/json && storyblok pull-components --space=${config?.spaceId}`

  await new Promise((resolve, reject) => {
    exec(pullCommand, (error, _, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        reject(error)
        return
      }

      if (stderr) {
        console.error(`Command execution failed: ${stderr}`)
        reject(error)
        return
      }

      console.info('Pulled components successfully')
      resolve(stdout)
    })
  })

  await handlerFunction()
}
