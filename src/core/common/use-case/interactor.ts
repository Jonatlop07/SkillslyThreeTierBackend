export interface Interactor<InputModel, OutputModel> {
  execute(input: InputModel): Promise<OutputModel>;
}
