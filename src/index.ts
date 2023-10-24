#!/usr/bin/env node

import {Command} from 'commander';
import {generate} from './generate';

const program = new Command();

program
  .command('generate')
  .description('Call the generate command for the generate-storyblok-types function')
  .action(async () => {
    await generate(); // Call your generate function here
  });

program.parse(process.argv);
