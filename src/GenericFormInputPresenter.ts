import { observable, action, reaction, toJS } from 'mobx'
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

export interface TRule {
  condition: (value: any) => boolean
  errorMessage?: string
}

export class GenericFormInputPresenter<T> {
  @observable
  public value: T

  @observable
  public isValid: boolean = true

  @observable
  public errorMessages: string[] = []

  @observable
  public isDirty: boolean = false

  @observable
  public disabled: boolean = false

  @observable
  public required: boolean = false

  @observable
  private rules?: TRule[] = []

  private initialValue?: T

  private middleware: Array<(newValue: T) => T> = []

  constructor(initialValue: T) {
    this.initialValue = initialValue
    this.value = initialValue
    reaction(() => this.value, this.validate)
  }

  public onChange = (newValue: T) => {
    if (!this.disabled) {
      this.value = this.middleware.reduce(
        (accumulator, middleware) => middleware(accumulator),
        newValue
      )
      this.isDirty = true
    }
  }

  public withMiddleware? = (middleware: (newValue: T) => T) => {
    this.middleware.push(middleware)
    return this
  }

  public reset = () => {
    this.value = this.initialValue
    this.isDirty = false
  }

  @action
  public addCustomRule = (
    condition: (value: T) => boolean,
    errorMessage?: string
  ) => {

    if (errorMessage == '') throw new Error('Validation provided without empty message')
    this.rules.push({ condition, errorMessage })
    this.validate()
    return this
  }

  public mustBeEmail = (errorMessage?: string) => {
    return this.addCustomRule(MUST_BE_EMAIL, errorMessage)
  }

  public mustBeTrue = (errorMessage?: string) => {
    return this.addCustomRule(MUST_BE_TRUE, errorMessage)
  }

  public mustBeBool = (errorMessage?: string) => {
    return this.addCustomRule(MUST_BE_BOOL, errorMessage)
  }

  public mustBeString = (errorMessage?: string) => {
    return this.addCustomRule(MUST_BE_STRING, errorMessage)
  }

  public mustBeNumberPrimitive = (errorMessage?: string) => {
    return this.addCustomRule(MUST_BE_NUMBER_PRIMITIVE, errorMessage)
  }

  public mustBeNumber = (errorMessage?: string) => {
    return this.addCustomRule(MUST_BE_NUMBER, errorMessage)
  }

  public mustHaveMinLength = (length: number, errorMessage?: string) => {
    return this.addCustomRule(MIN_LENGTH(length), errorMessage)
  }

  public mustHaveMaxLength = (length: number, errorMessage?: string) => {
    return this.addCustomRule(MAX_LENGTH(length), errorMessage)
  }

  public isRequired = (errorMessage?: string) => {
    this.required = true
    return this.addCustomRule(MUST_BE_POPULATED, errorMessage)
  }

  public isDisabled = () => {
    this.disabled = true
    return this
  }

  @action
  private validate? = () => {
    let isValid = true
    let errorMessages = []
    this.rules.forEach(rule => {
      if (!rule.condition(this.value)) {
        isValid = false

        if (rule.errorMessage != undefined) {
          errorMessages.push(rule.errorMessage)
        }


      }
    })
    this.isValid = isValid
    this.errorMessages = errorMessages
  }
}
