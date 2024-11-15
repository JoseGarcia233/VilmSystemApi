import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterDto {
  @ApiProperty({
    required: false,
    description: 'Query string for filtering users',
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ description: 'Number of results per page', default: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @ApiProperty({ description: 'Page number to retrieve', default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false, description: 'Start date in YYYY-MM-DD format' })
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false, description: 'End date in YYYY-MM-DD format' })
  @IsOptional()
  endDate?: string;
}
