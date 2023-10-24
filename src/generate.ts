import {exec} from 'child_process';
import fs from 'fs';

export interface Config {
  apiKey: string;
  spaceId: string;
  pathToGeneratedTsFile: string;
}

export function getConfig(): Config | null {
  try {
    const data = fs.readFileSync('./generateTypesConfig.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading config file:', err);
    return null;
  }
}

export async function generate() {
  const config = getConfig();
  if (!config?.spaceId) {
    console.error('SpaceId not initialized. Call init() with the configuration first.');
  }

  const pullCommand = `cd ${__dirname}/../json && storyblok pull-components --space=${config?.spaceId}`;
  const generateCommand = `node ${__dirname}/generate-types.ts`;

  exec(pullCommand, (error, _, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Command execution failed: ${stderr}`);
      return;
    }
    console.log('Pulled components successfully');
  });
  exec(generateCommand, (error, _, stderr) => {
    if (error) {
      console.error(`Error while generating: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Command execution failed: ${stderr}`);
      return;
    }
    console.log('Generated types successfully');
  });
}
