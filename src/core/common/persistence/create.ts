export default interface Create<T> {
  create(t: T): Promise<T>;
}
