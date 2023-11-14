import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsOptional()
    @IsString()
    readonly user_name: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly confirmed_password: string;
}