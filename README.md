# validator

This is the validation script for The Clean Architecture (JavaScript)

## Getting Started

```bash
  npm install --save @logicroom/validator
```

or

```bash
  yarn add @logicroom/validator
```

## Purpose

The purpose of the Logic Room Validator is simplify adding validation and change handling to form inputs when using Mobx. The library exposes two new classes `GenericFormInputPresenter` and `GenericFormPresenter`. The former provides an intelligent form input API that can be extended to create view model code for any form input (e.g a TextInput). The latter is for grouping these inputs into a form and provides form level attributes and methods.

## GenericFormInputPresenter

### API

You create a new form input by newing up the class:

```typescript
import { GenericFormInputPresenter } from '@logicroom/validator'
const emailInput = new GenericFormInputPresenter<string>('email@address.com')
```

In the above example, a new text input has been created. We've told the GenericFormInputPresenter that the initial value is 'email@address.com'. We've also said that the value is of type 'string' passed as a generic in `<string>`.

This gives us access to the following properties and methods on the emailInput instance. All properties are observable via Mobx.

| Name                    | Property/Method | Value                                                                              | Default                                | Type                                                                |
| ----------------------- | --------------- | ---------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `value`                 | Property        | current value of input                                                             | initial value provided at construction | generic (provided at construction)                                  |
| `isValid`               | Property        | whether the current `value` passes all current validation rules                    | true                                   | `boolean`                                                           |
| `errorMessages`         | Property        | a list of messages for all currently non-passing rules                             | []                                     | `string[]`                                                          |
| `isDirty`               | Property        | whether value has been changed via onChange handler                                | false                                  | `boolean`                                                           |
| `disabled`              | Property        | whether the form input is disabled                                                 | false                                  | `boolean`                                                           |
| `required`              | Property        | whether the form input is required                                                 | false                                  | `boolean`                                                           |
| `onChange`              | Method          | the function to call to update the value (to be bound in the view layer)           |                                        | `(newValue: T) => void`                                             |
| `reset`                 | Method          | sets the `value` and `isDirty` back to their defaults                              |                                        | () => void                                                          |
| `addCustomRule`         | Method (fluent) | use this method to add a custom validation rule                                    |                                        | `(condition: (value: T) => boolean, errorMessage?: string) => this` |
| `mustBeEmail`           | Method (fluent) | value must conform to the General Email Regex found [here](http://emailregex.com/) | unset                                  | `(errorMessage?: string) => this`                                   |
| `mustBeTrue`            | Method (fluent) | value must be `true`                                                               | unset                                  | `(errorMessage?: string) => this`                                   |
| `mustBeBool`            | Method (fluent) | value must be `true` or `false`                                                    | unset                                  | `(errorMessage?: string) => this`                                   |
| `mustBeString`          | Method (fluent) | value must be of type `string`                                                     | unset                                  | `(errorMessage?: string) => this`                                   |
| `mustBeNumberPrimitive` | Method (fluent) | value must be of type `number`                                                     | unset                                  | `(errorMessage?: string) => this`                                   |
| `mustBeNumber`          | Method (fluent) | value must be of type `number` or valid number string (e.g. `'55'`)                | unset                                  | `(errorMessage?: string) => this`                                   |
| `minLength`             | Method (fluent) | value must have length equal or greater than provided number                       | unset                                  | `(length: number, errorMessage?: string) => this`                   |
| `maxLength`             | Method (fluent) | value must have length equal or less than provided number                          | unset                                  | `(length: number, errorMessage?: string) => this`                   |
| `isRequired`            | Method (fluent) | value must be populated                                                            | unset                                  | `(errorMessage?: string) => this`                                   |
| `isDisabled`            | Method (fluent) | input is disabled                                                                  | unset                                  | `() => this`                                                        |

### Examples

#### Creation

```typescript
const emailInput = new GenericFormInputPresenter<string>('email@address.com')
  .mustBeEmail()
  .isRequired()
```

### Update value

```typescript
emailInput.onChange('new@value.com`)
```

### Check validity

```typescript
const emailInput = new GenericFormInputPresenter<string>('email@address.com')
  .mustBeEmail('Your email address is not valid')
  .isRequired()

console.log(emailInput.isValid)
// true

emailInput.onChange('qwerty')

console.log(emailInput.isValid)
// false

console.log(emailInput.errorMessages)
// ['Your email address is not valid']
```

## GenericFormPresenter

### API

You create a new form by newing up the class:

```typescript
import {
  GenericFormInputPresenter,
  GenericFormPresenter
} from '@logicroom/validator'

// first we create the input(s) that will be used by the form
const emailInput = new GenericFormInputPresenter<string>('email@address.com')

// then we create the form and add our form input(s)
const myForm = new GenericFormPresenter().addFormInput(emailInput)
```

In the above example a new form is created with GenericFormPresenter. We've told our form that it has one form input (`emailInput`). The below table describes the properies and methods available on `myForm`.

| Name            | Property/Method | Value                                                                                          | Default | Type                                         |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------- | ------- | -------------------------------------------- |
| `isDirty`       | Property        | form is dirty if _any_ of the inputs are dirty                                                 | `false` | `boolean`                                    |
| `isValid`       | Property        | form is valid if _all_ of the inputs are valid _and_ no server errors exist                    | `true`  | `boolean`                                    |
| `serverErrors`  | Property        | set server errors to indicate validation errors that have been returned server side validation | `[]`    | `string[]`                                   |
| `errorMessages` | Property        | any server errors concatanated with any errors from invalid form inputs                        | `[]`    | `string[]`                                   |
| `addFormInput`  | Method (fluent) | call this method to add a form input to this form                                              |         | `(input: GenericFormInputPresenter) => this` |
| `resetForm`     | Method          | call this method to reset each input in the form                                               |         | `() => void`                                 |

### Examples

#### Creation

```typescript
const emailInput = new GenericFormInputPresenter<string>('')
const passwordInput = new GenericFormInputPresenter<string>('')

const myForm = new GenericFormPresenter()
  .addFormInput(emailInput)
  .addFormInput(passwordInput)
```

#### Reset Form

```typescript
const emailInput = new GenericFormInputPresenter<string>('intial')
const passwordInput = new GenericFormInputPresenter<string>('')

const myForm = new GenericFormPresenter()
  .addFormInput(emailInput)
  .addFormInput(passwordInput)

emailInput.onChange('foo')

console.log(emailInput.value)
// 'foo'

myForm.reset()

console.log(emailInput.value)
// 'intial'
```

#### Form validity / server errors

```typescript
const emailInput = new GenericFormInputPresenter<string>(
  'test@email.com'
).mustBeEmail('Must be email')

const myForm = new GenericFormPresenter().addFormInput(emailInput)

console.log(myForm.isValid)
// true

emailInput.onChange('not an email')

console.log(myForm.isValid)
// true

console.log(myForm.errors)
// ['Must be email']

myForm.serverErrors.push('Email not found, please register first')

console.log(myForm.errors)
// ['Must be email', 'Email not found, please register first']
```
