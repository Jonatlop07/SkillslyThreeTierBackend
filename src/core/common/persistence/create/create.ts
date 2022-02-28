export default interface Create<C, R> {
  create(c: C): Promise<R>;
}
