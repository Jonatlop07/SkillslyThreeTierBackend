export interface PartialUpdateByParams<T, U, Q> {
  partialUpdate(params: Q, updates: U): Promise<T>;
}
