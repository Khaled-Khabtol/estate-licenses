import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { AuthenticateDto } from './dto/authenticate.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() authDto: AuthenticateDto) {
        return this.usersService.login(authDto.email, authDto.password);
    }

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    async create(@Body() user: CreateUserDto): Promise<User> {
        if (user.password !== user.confirmed_password)
            throw new BadRequestException('password and confirmed password are not the same');
        return this.usersService.create(user);
    }

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        if (body.password !== body.confirmed_password)
            throw new BadRequestException('password and confirmed password are not the same');
        return this.usersService.update(id, body);
    }

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}