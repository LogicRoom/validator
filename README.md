# validator
This is the validation script for The Clean Architecture (JavaScript)

## Getting Started

```javascript
  npm install --save @logicroom/validator
```

or

```javascript
  yarn add @logicroom/validator
```

## Purpose

The purpose of the Logic Room Validator is simplify adding validation to form inputs when using Mobx. The addition of the `@validated` decorator modifies the original observable to include an onChange handler and further functions for determining whether the value assigned to the variable is valid based on the rules passed to the validator decoration. The use of the validated decorator also decorates the variable with the Mobx observable decorator for use with applications where Mobx is used for state management.

## Use Cases

To use the Logic Room Validitor the `@validated` decorator is used to decorate the varibale. The decorator takes various parameters which define how the variable should be treated to determine whther it is valid for the given context or not.

### Text Input Validation

Original code would often look like:

```javascript
  @observable
  public username: string = ''
```

For use with validation this is converted to:

```javascript
  @validated(options)
  public username: IValidatedInput<string>  = ''
```

Options is an object containing the fields discussed below.

The IValidatedInput return type is defined as:

```javascript
interface IValidatedInput<TReturn> {
  // the value of the input
  value?: TReturn
  // is the input valid
  isValid?: boolean
  // the function called to change the value (NB, you can also change the value directly)
  onChange?: (value: any) => void
  // says whether the input has ever been chaned
  isDirty?: boolean
  // a list of current error messsages
  errorMessages?: string[]
  // clears the value and sets isValid and isDirty to default
  reset?: () => void
}
```

## Options

The two options that can be passed to the `@validated` decorator are:

```javascript
mandatory?: boolean
rules: TRule | TRule[]
```

where TRule is defined as:

```javscript
interface TRule {
  rule: (value: any) => boolean
  errorMessage?: string
}
```

### Rules

The Logic Room validator has the following rule presets. Each preset is a function that takes the value and tests it againse the rule. The function returns a boolean that indicates whether the test passed:

1. MUST_BE_TRUE
   - `value === true`
2. MUST_BE_BOOL
   - `value === true || value === false`
3. MUST_BE_STRING
   - `typeof value === 'string'`
4. MUST_BE_NUMBER_PRIMITIVE
   - `typeof value === 'number'`
5. MUST_BE_NUMBER
   - `!isNaN(value)` 
6. MUST_BE_EMAIL
   - value must conform to the General Email Regex found [here](http://emailregex.com/)
7. MIN_LENGTH(length)
   - `value.length > length`
8. MAX_LENGTH(length)
   - `value.length < length` 

## Example

A hypothetical example of a registration form may look like:

```javascript
  @validated({
    manadatory: true,
    rules: [
      {
        rule: MUST_BE_EMAIL,
        errorMessage: 'Your entry does not look like an email.'
      }
    ]
  })
  public username: IValidatedInput<string>  = ''

  @validated({
    manadatory: true,
    rules: [
      {
        rule: MAX_LENGTH(25),
        errorMessage: 'Password must be less than 25 characters.'
      },
      {
        rule: MIN_LENGTH(5),
        errorMessage: 'Password must be at least 5 characters long.'
      }
    ]
  })
  public password: IValidatedInput<string>  = ''

  @validated({
    rules: [
      {
        rule: MAX_BE_TRUE,
        errorMessage: 'You must accept the terms and conditions'
      }
    ]
  })
  public tAndCCheckbox: IValidatedInput<boolean>  = ''
```
