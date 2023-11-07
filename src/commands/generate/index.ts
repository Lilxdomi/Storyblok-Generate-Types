import {Command} from '@oclif/core'
import {generate} from '../../utils/generate'

export default class Generate extends Command {
  static description = 'Generate your Types'

  static examples = [
    `$ oex generate
Pulled components successfully
`,
  ]

  async run(): Promise<void> {
    await generate()
  }
}
