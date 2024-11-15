import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterWithoutPageDto {
  @ApiProperty({
    required: false,
    description: 'Query string for filtering users',
  })
  @IsOptional()
  @IsString()
  query?: string;
}
