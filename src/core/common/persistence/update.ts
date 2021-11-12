export default interface Update<T> {
  update(previous: T, next: Partial<T>): Promise<T>;
}
