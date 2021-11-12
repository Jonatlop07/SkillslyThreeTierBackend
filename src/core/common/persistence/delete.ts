export default interface Delete<T> {
  deleteById(id: string): Promise<T>;
}
