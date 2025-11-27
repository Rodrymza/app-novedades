export class AppError extends Error {
  public statusCode: number;
  public detail: string;
  constructor(message: string, statusCode: number, detail: string) {
    super(message);

    this.statusCode = statusCode;
    this.detail = detail;
    Error.captureStackTrace(this, this.constructor);
  }
}
