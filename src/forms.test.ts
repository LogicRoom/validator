import { GenericFormInputPresenter } from './GenericFormInputPresenter'
import { GenericFormPresenter } from './GenericFormPresenter'

test('login scenario', () => {
  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail('You must provide a valid email address')
    .isRequired()

  const password = new GenericFormInputPresenter<string>('').isRequired(
    'You must populate the password field'
  )

  const form = new GenericFormPresenter()
    .addFormInput(email)
    .addFormInput(password)

  expect(email.isValid).toBe(false)
  expect(email.isDirty).toBe(false)

  expect(password.isValid).toBe(false)
  expect(password.isDirty).toBe(false)

  expect(form.isValid).toBe(false)
  expect(form.isDirty).toBe(false)
  expect(form.errorMessages).toEqual([
    'You must provide a valid email address',
    'You must populate the password field'
  ])

  email.onChange('test@test.com')

  expect(email.isValid).toBe(true)
  expect(email.isDirty).toBe(true)

  expect(password.isValid).toBe(false)
  expect(password.isDirty).toBe(false)

  expect(form.isValid).toBe(false)
  expect(form.isDirty).toBe(true)
  expect(form.errorMessages).toEqual(['You must populate the password field'])
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
