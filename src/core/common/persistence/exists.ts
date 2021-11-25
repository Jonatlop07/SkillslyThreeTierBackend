export default interface Exists<T> {
  exists(t: T): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
}
