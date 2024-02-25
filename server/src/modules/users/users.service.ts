import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.module';
import { userNotExist } from '../../utils/throws';
import { generatePasswordHash } from '../../utils/passwordUtils';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const passwordHash = generatePasswordHash(createUserDto.password);
    return this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password_hash: passwordHash,
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) userNotExist();

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const passwordHash = generatePasswordHash(updateUserDto.password);
    const user = await this.prismaService.user.update({
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        password_hash: passwordHash,
      },
      where: { id },
    });
    if (!user) userNotExist();

    return user;
  }

  async remove(id: number) {
    const user = await this.prismaService.user.delete({ where: { id } });
    if (!user) userNotExist();

    return user;
  }
}