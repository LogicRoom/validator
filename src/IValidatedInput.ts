export interface IValidatedInput<TReturn> {
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
