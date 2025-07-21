import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class SignupDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(30, { message: 'Password cannot be more than 30 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  confirmPassword: string;
}
