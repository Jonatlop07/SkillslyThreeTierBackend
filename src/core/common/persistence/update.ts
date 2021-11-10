export default interface Update<T> {
  update(t: T): Promise<T>;
}
