import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
  Min,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DocumentDto {
  @IsString()
  url: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Ayuda para operación de mi hijo' })
  @IsString()
  @MinLength(10)
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Salud' })
  @IsString()
  category: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(1000)
  goalAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({ description: 'Historia completa' })
  @IsString()
  @MinLength(50)
  story: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({ description: 'Motivo de la ayuda' })
  @IsString()
  @MinLength(20)
  reason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mainImageUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @ApiPropertyOptional({ type: [DocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documentUrls?: DocumentDto[];
}
