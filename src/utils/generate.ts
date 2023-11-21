import fs from 'fs'
import {exec, spawn} from 'child_process'
import {handlerFunction} from './generate-types'
import {stdout} from 'process'

export interface Config {
  apiKey: string
  pathToGeneratedTsFile: string
  spaceId: string
}

export function getConfig(): Config | null {
  try {
    const data = fs.readFileSync(`${process.cwd()}/generateTypesConfig.json`, 'utf8')
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
    const childProcess = spawn('sh', ['-c', pullCommand], {stdio: 'inherit'})

    childProcess.on('exit', (code) => {
      if (code === 0) {
        console.info('Pulled components successfully')
        resolve(code)
      } else {
        console.error(`Command exited with code ${code}`)
        reject(code)
      }
    })

    childProcess.on('error', (err) => {
      console.error(`Process error: ${err}`)
      reject(err)
    })
  })

  await handlerFunction()
}
