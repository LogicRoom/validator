import { observable, action, computed } from 'mobx'
import { GenericFormInputPresenter } from 'src/GenericFormInputPresenter'

export class GenericFormPresenter {
  @observable
  public serverErrors?: string[] = []

  @observable
  private formInputs?: GenericFormInputPresenter<any>[] = []

  public addFormInput(formInput: GenericFormInputPresenter<any>) {
    this.formInputs.push(formInput)
    return this
  }

  @computed
  public get isDirty(): boolean {
    return this.formInputs
      .map(input => input.isDirty)
      .reduce((accumulator, currentValue) => {
        if (accumulator) return true
        return currentValue
      }, false)
  }

  @computed
  public get isValid(): boolean {
    if ((this.serverErrors || []).length > 0) return false

    return this.formInputs
      .map(input => input.isValid)
      .reduce((accumulator, currentValue) => {
        if (!accumulator) return false
        return currentValue
      }, true)
  }

  @computed
  public get errorMessages(): string[] {
    return (this.serverErrors || []).concat(
      this.formInputs
        .filter(input => {return input.value != ''})
        .reduce((accumulator, input) => {
          return accumulator.concat(input.errorMessages)
        }, [])
    )
  }

  @action
  public reset() {
    this.formInputs.forEach(input => {
      input.reset()
    })
    this.serverErrors = []
  }
}
