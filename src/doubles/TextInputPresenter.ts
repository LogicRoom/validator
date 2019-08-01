import { GenericFormInputPresenter } from '../GenericFormInputPresenter'
import { observable } from 'mobx'
import { TIcons } from './TIcons'
import { TTextInputType } from './TTextInputType'

export class TextInputPresenter extends GenericFormInputPresenter<string> {
  @observable
  public disabled = false

  @observable
  public label = ''

  @observable
  public required = false

  @observable
  public iconPrefix: TIcons

  @observable
  public iconPrefixColor: string

  @observable
  public helpText: string

  @observable
  public multiline = false

  @observable
  public type: TTextInputType = 'text'

  constructor(initialValue = '') {
    super(initialValue)
  }

  public withIconPrefix = (iconPrefix: TIcons) => {
    this.iconPrefix = iconPrefix
    return this
  }

  public withIconPrefixColor = (color: string) => {
    this.iconPrefixColor = color
    return this
  }

  public withHelpText = (helpText: string) => {
    this.helpText = helpText
    return this
  }

  public withLabel = (label: string) => {
    this.label = label
    return this
  }

  public withType = (type: TTextInputType) => {
    this.type = type
    return this
  }

  public isMultiline = () => {
    this.multiline = true
    return this
  }
}
