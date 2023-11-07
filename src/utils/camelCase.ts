const SEPARATORS = /[_.\- ]+/
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u
const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source)
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gu')
const NUMBERS_AND_IDENTIFIER = new RegExp('\\d+' + IDENTIFIER.source, 'gu')

const postProcess = (input: string, toUpperCase: any) => {
  SEPARATORS_AND_IDENTIFIER.lastIndex = 0
  NUMBERS_AND_IDENTIFIER.lastIndex = 0

  return input
    .replaceAll(NUMBERS_AND_IDENTIFIER, (match, _, offset) =>
      ['_', '-'].includes(input.charAt(offset + match.length)) ? match : toUpperCase(match),
    )
    .replaceAll(SEPARATORS_AND_IDENTIFIER, (_, identifier) => toUpperCase(identifier))
}

export default function camelCase(input: string | string[], options?: {pascalCase?: boolean}) {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected the input to be `string | string[]`')
  }

  options = {
    pascalCase: false,
    ...options,
  }

  if (Array.isArray(input)) {
    input = input
      .map((x) => x.trim())
      .filter((x) => x.length)
      .join('-')
  } else {
    input = input.trim()
  }

  if (input.length === 0) {
    return ''
  }

  const toLowerCase = (string: string) => string.toLowerCase()
  const toUpperCase = (string: string) => string.toUpperCase()

  if (input.length === 1) {
    if (SEPARATORS.test(input)) {
      return ''
    }

    return options.pascalCase ? toUpperCase(input) : toLowerCase(input)
  }

  input = input.replace(LEADING_SEPARATORS, '')
  input = toLowerCase(input)

  if (options.pascalCase) {
    input = toUpperCase(input.charAt(0)) + input.slice(1)
  }

  return postProcess(input, toUpperCase)
}
