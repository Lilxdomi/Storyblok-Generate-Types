#!/usr/bin/env node

import {Command} from 'commander';
import {generate} from 'src';

const program = new Command();

program
  .command('generate-storyblok-types')
  .description('Call the generate command for the generate-storyblok-types function')
  .action(async () => {
    await generate(); // Call your generate function here
  });

program.parse(process.argv);
