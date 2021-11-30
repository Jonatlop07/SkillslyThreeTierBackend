export abstract class CoreException extends Error {
  abstract code: number;
  abstract message: string;
}
