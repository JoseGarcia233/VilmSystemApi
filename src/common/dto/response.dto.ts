export class ResponseDto<T> {
  title: string;
  description: string;
  isError: boolean;
  statusCode: number;
  data?: T;

  constructor(
    title: string,
    description: string,
    isError: boolean,
    statusCode: number,
    data?: T,
  ) {
    this.title = title;
    this.description = description;
    this.isError = isError;
    this.statusCode = statusCode;
    this.data = data;
  }
}
