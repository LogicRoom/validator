import { GenericFormInputPresenter } from './GenericFormInputPresenter'
import { GenericFormPresenter } from './GenericFormPresenter'

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

test('a single invalid input', () => {

  const { email, password, form } = setupEmptyFields()

  email.onChange('INVALID EMAIL')

  expect(email.isDirty).toBe(true)
  expect(email.isValid).toBe(false)

  expect(password.isDirty).toBe(false)
  expect(password.isValid).toBe(false)

  expect(form.isDirty).toBe(true)
  expect(form.isValid).toBe(false)

  expect(form.errorMessages.length).toBe(1)

})

test('should flatten error messages', () => {

  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail('You must provide a valid email address')
    .isRequired('You must provide an email address')

  const password = new GenericFormInputPresenter<any>('')
    .mustBeString('You must provide a string for password')
    .isRequired('You must populate the password field'
  )

  const form = new GenericFormPresenter()
    .addFormInput(email)
    .addFormInput(password)

  email.onChange('INVALID EMAIL')
  password.onChange(123123123)

  expect(email.isDirty).toBe(true)
  expect(email.isValid).toBe(false)

  expect(password.isDirty).toBe(true)
  expect(password.isValid).toBe(false)

  expect(form.isDirty).toBe(true)
  expect(form.isValid).toBe(false)

  expect(form.errorMessages.length).toBe(2)
  expect(form.errorMessages).toEqual([ 'You must provide a valid email address',
    'You must provide a string for password' ])

})

test('can update and reset form', () => {
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

test('can apply middleware', () => {
  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail()
    .isRequired()
    .withMiddleware(newValue => newValue.toUpperCase())

  expect(email.value).toBe('')

  email.onChange('test@test.com')

  expect(email.value).toBe('TEST@TEST.COM')
})
