export const MUST_BE_TRUE = (value: any) => {
  return value === true
}

export const MUST_BE_BOOL = (value: any) => {
  return value === true || value === false
}

export const MUST_BE_STRING = (value: any) => {
  return typeof value === 'string'
}

export const MUST_BE_NUMBER = (value: any) => {
  return typeof value === 'number'
}

export const MUST_BE_EMAIL = (value: any) => {
  const validEmailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  return validEmailPattern.test(value)
}

export const MIN_LENGTH = (length: number) => (value: any) => {
  return value.length > length
}

export const MAX_LENGTH = (length: number) => (value: any) => {
  return value.length < length
}
