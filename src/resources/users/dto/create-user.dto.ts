import { IsDateString, IsEmail, IsNumberString, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	readonly username: string;

	@IsEmail()
	readonly email: string;

	@IsString()
	readonly firstName: string;

	@IsString()
	readonly lastName: string;

	@IsNumberString()
	readonly phone: string;

	@IsString()
	readonly address: string;

	@IsString()
	readonly city: string;

	@IsString()
	readonly country: string;

	@IsDateString()
	readonly dateOfBirth: string;

	@IsString()
	readonly gender: string;
}
