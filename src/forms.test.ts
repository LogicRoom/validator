import { GenericFormInputPresenter } from './GenericFormInputPresenter'
import { GenericFormPresenter } from './GenericFormPresenter'
import { TextInputPresenter } from './doubles/TextInputPresenter'

test('when no values in inputs then no error messages', () => {

  const email = new TextInputPresenter()
    .withHelpText(
      `You must enter the email that you were registered with. You can find this
        in the "Invitation Instructions" email, sent to you by 
        automated@cutover.com`
    )
    .withLabel('Email')
    .withType('email')
    .mustBeEmail()
    .isRequired()

    const password = new TextInputPresenter()
    .withHelpText(
      `If a previous password is not working, it may have been expired according
      to your corporate password expiry policy. To create a new password, click
      on "Forgot Password" below and enter the email you registered with`
    )
    .withLabel('Password')
    .withType('password')
    .mustBeString()
    .isRequired()

  const form = new GenericFormPresenter()
    .addFormInput(email)
    .addFormInput(password)

  expect(form.errorMessages.length).toBe(0)

})



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

test('can apply middleware', () => {
  const email = new GenericFormInputPresenter<string>('')
    .mustBeEmail()
    .isRequired()
    .withMiddleware(newValue => newValue.toUpperCase())

  expect(email.value).toBe('')

  email.onChange('test@test.com')

  expect(email.value).toBe('TEST@TEST.COM')
})
