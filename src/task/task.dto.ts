import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  description: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
