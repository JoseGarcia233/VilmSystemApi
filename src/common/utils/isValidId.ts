import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function ValidateId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(
      'ID inválido. Debe ser un ID de MongoDB válido.',
    );
  }
}
