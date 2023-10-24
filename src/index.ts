import {exec} from 'child_process';

export interface Config {
  apiKey: string;
  spaceId: string;
  pathToGeneratedTsFile: string;
}

export function getConfig(): Config | null {
  return config;
}

export let config: Config | null = null;

export function initGenerate(options: Config): void {
  config = options;
}

export async function generate() {
  if (!config?.spaceId) {
    console.error('SpaceId not initialized. Call init() with the configuration first.');
  }

  const pullCommand = `cd ../json && storyblok pull-components --space=${config?.spaceId}`;
  const generateCommand = 'node ../generate-types.mjs';

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
