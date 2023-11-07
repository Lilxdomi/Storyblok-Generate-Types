// Credits go to the founder of the original camelcase package -> sindresorhus
// I only copied this code to reduce dependencies

const UPPERCASE = /[\p{Lu}]/u
const LOWERCASE = /[\p{Ll}]/u
const SEPARATORS = /[_.\- ]+/
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u
const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source)
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gu')
const NUMBERS_AND_IDENTIFIER = new RegExp('\\d+' + IDENTIFIER.source, 'gu')

const preserveCamelCase = (
  string: string,
  toLowerCase: (string: string) => string,
  toUpperCase: (string: string) => string,
) => {
  let isLastCharLower = false
  let isLastCharUpper = false
  let isLastLastCharUpper = false
  let isLastLastCharPreserved = false

  for (let index = 0; index < string.length; index++) {
    const character = string[index]
    isLastLastCharPreserved = index > 2 ? string[index - 3] === '-' : true

    if (isLastCharLower && UPPERCASE.test(character)) {
      string = string.slice(0, index) + '-' + string.slice(index)
      isLastCharLower = false
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = true
      index++
    } else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character) && !isLastLastCharPreserved) {
      string = string.slice(0, index - 1) + '-' + string.slice(index - 1)
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = false
      isLastCharLower = true
    } else {
      isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character
      isLastLastCharUpper = isLastCharUpper
      isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character
    }
  }

  return string
}

const postProcess = (input: string, toUpperCase: (string: string) => string) => {
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

  if (options.pascalCase) {
    input = toUpperCase(input.charAt(0)) + input.slice(1)
  }

  const hasUpperCase = input !== toLowerCase(input)
  if (hasUpperCase) {
    input = preserveCamelCase(input, toLowerCase, toUpperCase)
  }

  return postProcess(input, toUpperCase)
}
