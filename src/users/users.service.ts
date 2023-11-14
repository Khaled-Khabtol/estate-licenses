import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) public userRepo: Repository<User>) { }

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

    async findAll(): Promise<User[]> {
        const users = await this.userRepo.find();
        users.map((user) => delete user.password);
        return users;
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

        delete updateUser.password;
        return this.userRepo.save(updateUser);
    }

}