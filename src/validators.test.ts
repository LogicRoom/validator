import {
  MUST_BE_POPULATED,
  MUST_BE_EMAIL,
  MUST_BE_TRUE,
  MUST_BE_BOOL,
  MUST_BE_NUMBER,
  MUST_BE_NUMBER_PRIMITIVE,
  MUST_BE_STRING,
  MAX_LENGTH,
  MIN_LENGTH
} from 'src/validators'

test('MUST_BE_POPULATED', () => {
  expect(MUST_BE_POPULATED(true)).toBe(true)
  expect(MUST_BE_POPULATED(0)).toBe(true)
  expect(MUST_BE_POPULATED('a')).toBe(true)

  expect(MUST_BE_POPULATED(undefined)).toBe(false)
  expect(MUST_BE_POPULATED('')).toBe(false)
})

test('MUST_BE_TRUE', () => {
  expect(MUST_BE_TRUE(true)).toBe(true)

  expect(MUST_BE_TRUE(false)).toBe(false)
  expect(MUST_BE_TRUE('some string')).toBe(false)
})

test('MUST_BE_BOOL', () => {
  expect(MUST_BE_BOOL(false)).toBe(true)
  expect(MUST_BE_BOOL(true)).toBe(true)

  expect(MUST_BE_BOOL(0)).toBe(false)
  expect(MUST_BE_BOOL('some string')).toBe(false)
})

test('MUST_BE_STRING', () => {
  expect(MUST_BE_STRING('')).toBe(true)
  expect(MUST_BE_STRING('some string')).toBe(true)

  expect(MUST_BE_STRING(55)).toBe(false)
  expect(MUST_BE_STRING(false)).toBe(false)
})

test('MUST_BE_NUMBER_PRIMITIVE', () => {
  expect(MUST_BE_NUMBER_PRIMITIVE(5)).toBe(true)

  expect(MUST_BE_NUMBER_PRIMITIVE('5')).toBe(false)
})

test('MUST_BE_NUMBER', () => {
  expect(MUST_BE_NUMBER(5)).toBe(true)
  expect(MUST_BE_NUMBER('5')).toBe(true)

  expect(MUST_BE_NUMBER('five')).toBe(false)
})

test('MUST_BE_EMAIL', () => {
  expect(MUST_BE_EMAIL('email@email.com')).toBe(true)

  expect(MUST_BE_EMAIL('email@email')).toBe(false)
})

test('MIN_LENGTH', () => {
  expect(MIN_LENGTH(4)('word')).toBe(true)
  expect(MIN_LENGTH(0)('w')).toBe(true)

  expect(MIN_LENGTH(10)('word')).toBe(false)
})

test('MAX_LENGTH', () => {
  expect(MAX_LENGTH(4)('word')).toBe(true)
  expect(MAX_LENGTH(0)('')).toBe(true)

  expect(MAX_LENGTH(5)('some words')).toBe(false)
})
