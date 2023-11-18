import { ConflictException, ForbiddenException, Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnApplicationBootstrap {

    private readonly logger = new Logger(UsersService.name);

    constructor(@InjectRepository(User) public userRepo: Repository<User>,
        private readonly configService: ConfigService) { }

    async onApplicationBootstrap() {
        const email = this.configService.get<string>('ROOT_EMAIL');
        const password = this.configService.get<string>('ROOT_PASSWORD');
        const user_name = this.configService.get<string>('ROOT_USERNAME');

        const rootUser = {
            "id": 1,
            "user_name": user_name,
            "email": email,
            "password": password,
            "role": "admin"
        }

        const user = await this.userRepo.findOne({
            where: { "id": 1 }
        });

        if (!user) {
            const newUser = this.userRepo.create(rootUser);
            this.userRepo.save(newUser);
            this.logger.log(`user root with email ${newUser.email} added successfully`);
        }
        else
            this.logger.log('user root is already exists');
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({ where: { "email": email } });

        if (user?.password !== password)
            throw new NotFoundException('Invalid credentials');

        delete user.password;
        delete user.created_at;
        delete user.updated_at;

        const token = sign({ ...user }, 'trszhq!@$#%^*&()weqzaq', { expiresIn: '4h' });
        return { token, user };
    }

    async findAll(page: number, limit: number) {
        const usersCount = await this.userRepo.count();
        const users = await this.findWithPagination(page, limit);
        users.map((user) => delete user.password);
        return { users, page, usersCount };
    }

    async create(user: Partial<User>): Promise<User> {
        const existUser = await this.userRepo.findOne({ where: { "email": user.email } });

        if (existUser)
            throw new ConflictException(`User with email ${user.email} already exists`);

        const newUser = this.userRepo.create(user);
        return this.userRepo.save(newUser);
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { id }
        });

        if (!user)
            throw new NotFoundException(`id ${id} doesn't exists`);

        delete user.password;
        return user;
    }

    async remove(id: string) {
        if (+id === 1)
            throw new ForbiddenException('The admin cannot be deleted');
        const deleteUser = await this.userRepo.delete(id);
        if (deleteUser.affected === 0)
            throw new NotFoundException(`User with id ${id} doesn't exists`);

        return { "message": `User with id ${id} Deleted Successfully` };
    }

    async update(id: string, dto: UpdateUserDto) {
        const updateUser = await this.userRepo.preload({
            id: +id,
            ...dto
        })

        if (!updateUser)
            throw new NotFoundException(`User with id ${id} doesn't exists`);

        if (dto?.email) {
            const existUser = await this.userRepo.findOne({ where: { "email": dto.email } });

            if (existUser && existUser.id !== +id)
                throw new ConflictException(`User with email ${dto.email} already exists`);
        }

        delete updateUser.password;
        return this.userRepo.save(updateUser);
    }

    async findWithPagination(page: number = 1, limit: number = 9): Promise<User[]> {
        const skip = (page - 1) * limit;

        return await this.userRepo.find({
            skip,
            take: limit,
        });
    }

}
