export default interface Exists<F> {
  exists(params: F): Promise<boolean>;
}
