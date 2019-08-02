import { observable, action, computed, toJS } from 'mobx'
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
    return (toJS(this.serverErrors) || []).concat(
      toJS(this.formInputs)
        .filter(input => {
          let hasBeenPopulated = !(input.value == '' && !input.isDirty)
          return hasBeenPopulated;
        })
        .reduce((flat, inputToFlatten) => {
          return flat.concat(inputToFlatten.errorMessages)
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
