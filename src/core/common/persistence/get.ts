export default interface Get<T> {
  get(value: any): Promise<T>;
}
