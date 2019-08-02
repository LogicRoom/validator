import { GenericFormInputPresenter } from './GenericFormInputPresenter'
import { GenericFormPresenter } from './GenericFormPresenter'
import { toJS } from 'mobx'

const setupEmptyFields = () => {
  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail()
    .isRequired()

  const password = new GenericFormInputPresenter<string>('')
    .mustBeString()
    .isRequired()

  const form = new GenericFormPresenter()
    .addFormInput(email)
    .addFormInput(password)

  return { email, password, form }
}

test('fresh form', () => {
  const { email, password, form } = setupEmptyFields()
  expect(email.isDirty).toBe(false)
  expect(email.isValid).toBe(false)

  expect(password.isDirty).toBe(false)
  expect(password.isValid).toBe(false)

  expect(form.isDirty).toBe(false)
  expect(form.isValid).toBe(false)

  expect(form.errorMessages.length).toBe(0)
})

test('single valid input', () => {
  const { email, password, form } = setupEmptyFields()

  email.onChange('test@test.com')

  expect(email.isDirty).toBe(true)
  expect(email.isValid).toBe(true)

  expect(password.isDirty).toBe(false)
  expect(password.isValid).toBe(false)

  expect(form.isDirty).toBe(true)
  expect(form.isValid).toBe(false)

  expect(form.errorMessages.length).toBe(0)

})

test('single invalid input', () => {

  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail('must be email')
    .isRequired('must be email')

  const password = new GenericFormInputPresenter<string>('')
    .mustBeString()
    .isRequired()

  const form = new GenericFormPresenter()
    .addFormInput(email)
    .addFormInput(password)

  email.onChange('INVALID EMAIL')

  expect(email.isDirty).toBe(true)
  expect(email.isValid).toBe(false)

  expect(password.isDirty).toBe(false)
  expect(password.isValid).toBe(false)

  expect(form.isDirty).toBe(true)
  expect(form.isValid).toBe(false)

  expect(form.errorMessages.length).toBe(1)

})

test('empty validation message should not produce error messages (but still be in error state)', () => {

  const email = new GenericFormInputPresenter<string>('').mustBeEmail()

  const form = new GenericFormPresenter().addFormInput(email)

  email.onChange('INVALID EMAIL')

  expect(form.errorMessages.length).toBe(0)

})

test('should flatten error messages + recalculate messages', () => {

  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail('You must provide a valid email address')
    .mustHaveMinLength(15, 'Min email length is 15 characters')

  const password = new GenericFormInputPresenter<any>('')
    .mustBeString('You must provide a string for password')
    .mustHaveMinLength(22, 'Min password length is 22 characters')

  const form = new GenericFormPresenter()
    .addFormInput(email)
    .addFormInput(password)

  email.onChange('INVALID EMAIL')
  password.onChange(333)

  expect(toJS(form.errorMessages)).toEqual( [ 'You must provide a valid email address',
    'Min email length is 15 characters',
    'You must provide a string for password',
    'Min password length is 22 characters' ])

  email.onChange('')
  password.onChange('')

  expect(toJS(form.errorMessages)).toEqual( [ 'You must provide a valid email address',
    'Min email length is 15 characters',
    'Min password length is 22 characters' ])

})

test('should update and reset form', () => {
  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail()
    .isRequired()

  const password = new GenericFormInputPresenter<string>('').isRequired()

  const form = new GenericFormPresenter()
    .addFormInput(email)
    .addFormInput(password)

  expect(email.value).toBe('')
  expect(password.value).toBe('')

  email.onChange('test@test.com')
  password.onChange('some string')

  expect(email.value).toBe('test@test.com')
  expect(password.value).toBe('some string')

  form.reset()

  expect(email.value).toBe('')
  expect(password.value).toBe('')
})

test('should apply middleware', () => {
  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail()
    .isRequired()
    .withMiddleware(newValue => newValue.toUpperCase())

  expect(email.value).toBe('')

  email.onChange('test@test.com')

  expect(email.value).toBe('TEST@TEST.COM')
})
