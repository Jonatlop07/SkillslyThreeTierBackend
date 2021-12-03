export default interface Delete<T, V> {
  deleteById(id: string): Promise<T>;
  delete(params: V): Promise<T>;
}
