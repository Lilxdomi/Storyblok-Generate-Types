# Generate Storyblok Types

This package is designed to automatically generate types based on the components from Storyblok

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Generate Storyblok Types](#generate-storyblok-types)
* [Usage](#usage)
* [Requirements](#requirements)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g storyblok-generate-types
$ storyblok-generate-types COMMAND
running command...
$ storyblok-generate-types (--version)
storyblok-generate-types/1.0.6 darwin-arm64 node-v18.16.1
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

# Commands

<!-- commands -->
* [`storyblok-generate-types generate`](#storyblok-generate-types-generate)
* [`storyblok-generate-types help [COMMANDS]`](#storyblok-generate-types-help-commands)
* [`storyblok-generate-types plugins`](#storyblok-generate-types-plugins)
* [`storyblok-generate-types plugins:install PLUGIN...`](#storyblok-generate-types-pluginsinstall-plugin)
* [`storyblok-generate-types plugins:inspect PLUGIN...`](#storyblok-generate-types-pluginsinspect-plugin)
* [`storyblok-generate-types plugins:install PLUGIN...`](#storyblok-generate-types-pluginsinstall-plugin-1)
* [`storyblok-generate-types plugins:link PLUGIN`](#storyblok-generate-types-pluginslink-plugin)
* [`storyblok-generate-types plugins:uninstall PLUGIN...`](#storyblok-generate-types-pluginsuninstall-plugin)
* [`storyblok-generate-types plugins:uninstall PLUGIN...`](#storyblok-generate-types-pluginsuninstall-plugin-1)
* [`storyblok-generate-types plugins:uninstall PLUGIN...`](#storyblok-generate-types-pluginsuninstall-plugin-2)
* [`storyblok-generate-types plugins update`](#storyblok-generate-types-plugins-update)

## `storyblok-generate-types generate`

Generate your Types

```
USAGE
  $ storyblok-generate-types generate

DESCRIPTION
  Generate your Types

EXAMPLES
  $ oex generate
  Pulled components successfully
```

_See code: [src/commands/generate/index.ts](https://github.com/Lilxdomi/storyblok-generate-types/blob/v1.0.6/src/commands/generate/index.ts)_

## `storyblok-generate-types help [COMMANDS]`

Display help for storyblok-generate-types.

```
USAGE
  $ storyblok-generate-types help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for storyblok-generate-types.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `storyblok-generate-types plugins`

List installed plugins.

```
USAGE
  $ storyblok-generate-types plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ storyblok-generate-types plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/index.ts)_

## `storyblok-generate-types plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ storyblok-generate-types plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ storyblok-generate-types plugins add

EXAMPLES
  $ storyblok-generate-types plugins:install myplugin 

  $ storyblok-generate-types plugins:install https://github.com/someuser/someplugin

  $ storyblok-generate-types plugins:install someuser/someplugin
```

## `storyblok-generate-types plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ storyblok-generate-types plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ storyblok-generate-types plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/inspect.ts)_

## `storyblok-generate-types plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ storyblok-generate-types plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ storyblok-generate-types plugins add

EXAMPLES
  $ storyblok-generate-types plugins:install myplugin 

  $ storyblok-generate-types plugins:install https://github.com/someuser/someplugin

  $ storyblok-generate-types plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/install.ts)_

## `storyblok-generate-types plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ storyblok-generate-types plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help      Show CLI help.
  -v, --verbose
  --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ storyblok-generate-types plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/link.ts)_

## `storyblok-generate-types plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ storyblok-generate-types plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ storyblok-generate-types plugins unlink
  $ storyblok-generate-types plugins remove
```

## `storyblok-generate-types plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ storyblok-generate-types plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ storyblok-generate-types plugins unlink
  $ storyblok-generate-types plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/uninstall.ts)_

## `storyblok-generate-types plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ storyblok-generate-types plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ storyblok-generate-types plugins unlink
  $ storyblok-generate-types plugins remove
```

## `storyblok-generate-types plugins update`

Update installed plugins.

```
USAGE
  $ storyblok-generate-types plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.0.2/src/commands/plugins/update.ts)_
<!-- commandsstop -->
