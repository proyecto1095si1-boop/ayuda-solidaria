import { IsString, IsNumber, IsOptional, IsEmail, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDonationDto {
  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(500)
  amount: number;

  @ApiPropertyOptional({ example: 'Juan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  donorName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  donorEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
