import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

interface ExceptionParams {
  title: string;
  description: string;
  isError?: boolean;
  statusCode: number;
}

/**
 * @param statusCode - Código de estado HTTP
 * @param title - Título del error
 * @param description - Descripción del error
 * @param isError - Si es un error (opcional, por defecto true)
 */
export function handleHttpException({
  title,
  description,
  statusCode,
  isError = true,
}: ExceptionParams): void {
  const errorResponse = {
    title,
    description,
    isError,
    statusCode,
  };

  switch (statusCode) {
    case 400:
      throw new BadRequestException(errorResponse);
    case 401:
      throw new UnauthorizedException(errorResponse);
    case 403:
      throw new ForbiddenException(errorResponse);
    case 404:
      throw new NotFoundException(errorResponse);
    case 500:
      throw new InternalServerErrorException(errorResponse);
    default:
      throw new HttpException(errorResponse, statusCode);
  }
}
