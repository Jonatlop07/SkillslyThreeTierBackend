export default interface PartialUpdate<T> {
  partialUpdate(previous: T, next: Partial<T>): Promise<T>;
}
