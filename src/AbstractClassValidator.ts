import { computed, observable, action, reaction } from 'mobx'
import 'reflect-metadata'
import { IValidatedInput } from './IValidatedInput'
import { injectable } from 'inversify'

@injectable()
export abstract class AbstractClassValidator {
  @observable
  public abstract serverErrors?: string[] = []

  @observable
  private observableInputs: IValidatedInput<any>[] = []

  @observable
  private lastChangedIndex: number | null = null

  constructor() {
    const keys = Reflect.getMetadataKeys(this.constructor).filter(key => {
      const prefix = key.split(':')[0]
      return prefix === 'validated'
    })

    this.observableInputs = keys.map(key =>
      Reflect.getMetadata(key, this.constructor)
    )

    this.observableInputs.forEach((input, index) => {
      reaction(
        () => input.value,
        () => {
          this.lastChangedIndex = index
          this.serverErrors = []
        }
      )
    })
  }

  @computed
  public get lastChangedErrors(): string[] {
    const lastChangedInput = this.observableInputs[this.lastChangedIndex]
    const errors = lastChangedInput
      ? lastChangedInput.errorMessages
      : this.errors
    return errors.concat(this.serverErrors)
  }

  @computed
  public get formIsDirty(): boolean {
    return this.observableInputs
      .map(input => input.isDirty)
      .reduce((accumulator, currentValue) => {
        if (!accumulator) return false
        return currentValue
      }, true)
  }

  @computed
  public get formIsValid(): boolean {
    if ((this.serverErrors || []).length > 0) return false
    return this.observableInputs
      .map(input => input.isValid)
      .reduce((accumulator, currentValue) => {
        if (!accumulator) return false
        return currentValue
      }, true)
  }

  @computed
  public get errors(): string[] {
    return (this.serverErrors || []).concat(
      this.observableInputs.reduce((accumulator, input) => {
        return accumulator.concat(input.errorMessages)
      }, [])
    )
  }

  @action
  public resetForm() {
    this.observableInputs.forEach(input => {
      input.reset()
    })
    this.serverErrors = []
  }
}
