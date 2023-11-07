# Generate Storyblok Types

This package is designed to automatically generate types based on the components from Storyblok

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->

- [Usage](#usage)
- [Requirements](#requirements)
- [Good to Know](#good-to-know)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ yarn add storyblok-generate-types
$ storyblok-generate-types COMMAND
running command...
$ storyblok-generate-types (--version)
storyblok-generate-types/0.0.0 darwin-arm64 node-v18.16.1
$ storyblok-generate-types --help [COMMAND]
USAGE
  $ storyblok-generate-types COMMAND
...
```

<!-- usagestop -->

<!-- requirements -->

# Requirements

You need to create a `generateTypesConfig.json` file to pass the needed options. This file needs to be in the root of the folder you call the command in.

##### Required Props:

- **spaceId:** Your Storyblok spaceId
  - **Required** to connect the pull command with the Storyblok Client
- **apiKey:** The specified API key for your Storyblok space
  - **Required** to connect the pull command with the Storyblok Client
  - found in Settings -> Access Tokens (Access Level: Preview)

##### Optional Props:

- **pathToGeneratedTsFile:** Defines the output fileName and destination
  - **Default** is `./generated.ts`

##### Example JSON File:

```
{
  "apiKey": "YOUR_SPACE_ID",
  "spaceId": "123456",
  "pathToGeneratedTsFile": "./generated.ts"
}

```

<!-- requirementsstop -->

<!-- goodtoknow -->

# Good to know

You need to install the `storyblok` cli globally so you can do `storyblok login`. This is needed, because the pull command verifies the authorization of the user.

This token will invalidate itself after about 2 weeks and the command will go stale and return no response. If this happens you need to do `storyblok logout` and `storyblok login` again.
I will immprove this handling in a future version and return an error if this happens.

<!-- goodtoknowstop -->

# Commands

<!-- commands -->

## `storyblok-generate-types generate`

Starts the command to pull the components from the specified space and then generate a file with types for the components.

```
USAGE
  $ storyblok-generate-types generate

DESCRIPTION
  Automatically generate types based on the storyblok
```

_See code: [src/commands/generate/index.ts](https://github.com/Lilxdomi/storyblok-generate-types/blob/v0.0.0/src/commands/generate/index.ts)_

## `storyblok-generate-types --version`

A command to check the version

```
USAGE
  $ storyblok-generate-types --version

DESCRIPTION
  Displays the current version

EXAMPLES
  $ node dev.js --version
storyblok-generate-types/0.0.0 darwin-arm64 node-v18.16.1
```

## `storyblok-generate-types --help`

A command to display the help

```
USAGE
  $ storyblok-generate-types --help

DESCRIPTION
  Displays the help
```

<!-- commandsstop -->
