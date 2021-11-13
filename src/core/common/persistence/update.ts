export default interface Update<T> {
  update(t: T): Promise<T>;
  update(previous: T, next: Partial<T>): Promise<T>;
}
