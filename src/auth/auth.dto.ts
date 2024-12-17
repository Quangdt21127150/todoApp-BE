import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^0[3|5|7|8|9]\d{8}$/, {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  phone: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
