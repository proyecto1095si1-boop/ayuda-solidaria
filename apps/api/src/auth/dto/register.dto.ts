import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsDateString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @ApiPropertyOptional({ enum: ['DONOR', 'BENEFICIARY'], default: 'DONOR' })
  @IsOptional()
  @IsEnum(['DONOR', 'BENEFICIARY'])
  role?: 'DONOR' | 'BENEFICIARY';

  // Campos de beneficiario
  @ApiPropertyOptional({ example: '30123456' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{7,8}$/, { message: 'DNI inválido' })
  dni?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'CBU de 22 dígitos' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{22}$/, { message: 'CBU debe tener 22 dígitos' })
  cbu?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountHolder?: string;
}
