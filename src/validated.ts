import { observable, runInAction, reaction, action } from 'mobx'
import { BabelDescriptor } from 'mobx/lib/internal'
import { IValidatedInput } from './IValidatedInput'
import 'reflect-metadata'

interface TRule {
  rule: (value: any) => boolean
  errorMessage?: string
}

interface IValidatedOptions {
  rules?: TRule | TRule[]
  mandatory?: boolean
  // TODO add mandatory error message
}

export function validated(options: IValidatedOptions): any {
  const { rules = [], mandatory = false } = options

  // if the presenter gives us a single rule then we just convert it to array of 1
  const rulesAsArray: TRule[] = Array.isArray(rules) ? rules : [rules]

  const getValidity = (
    newValue: any
  ): { valid: boolean; errorMessages: string[] } => {
    const isString = typeof newValue === 'string'
    const isEmpty: boolean =
      (isString && newValue.length === 0) || newValue === undefined

    if (!mandatory && isEmpty) {
      return { valid: true, errorMessages: [] }
    }

    if (mandatory && isEmpty) {
      return { valid: false, errorMessages: [] }
    }

    // it is valid until proven invalid by the rules
    let valid: boolean = true
    const errorMessages: string[] = []

    rulesAsArray.forEach(rule => {
      if (!rule.rule(newValue)) {
        valid = false
        if (rule.errorMessage) {
          errorMessages.push(rule.errorMessage)
        }
      }
    })

    return { valid, errorMessages }
  }

  return function(
    target: any,
    key: string | symbol,
    descriptor: BabelDescriptor
  ): any {
    const initialObject: any = descriptor.initializer
      ? descriptor.initializer()
      : {}

    // we set the intial 'value' on our returned object to
    // be the value of our presenter provided object or null if it
    // hasn't been provided
    const value = initialObject.hasOwnProperty('value')
      ? initialObject.value
      : ''

    const returnObject: IValidatedInput<any> = observable(
      {
        ...initialObject,
        value,
        isValid: false,
        isDirty: false,
        errorMessages: [],
        onChange: (newValue: string | boolean | number) => {
          returnObject.value = newValue
        },
        reset: () => {
          returnObject.value = value
          returnObject.isValid = false
          returnObject.isDirty = false
        }
      },
      {
        onChange: action,
        reset: action
      }
    )

    reaction(
      () => returnObject.value,
      newValue => {
        runInAction(() => {
          const { valid, errorMessages } = getValidity(newValue)
          returnObject.isValid = valid
          returnObject.errorMessages = errorMessages
          returnObject.value = newValue
          returnObject.isDirty = true
        })
      }
    )

    Reflect.defineMetadata(
      `validated:${key.toString()}`,
      returnObject,
      target.constructor
    )

    return { value: returnObject } as any
  }
}
