import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.module';
import { userAlreadyExist, userNotExists } from '../../utils/throws';
import { generatePasswordHash } from '../../utils/passwordUtils';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = generatePasswordHash(createUserDto.password);
    return await this.prismaService.users
      .create({
        data: {
          ...createUserDto,
          password: passwordHash,
        },
      })
      .catch((e) => {
        if (e.code === 'P2002') userAlreadyExist();
      });
  }

  findAll() {
    return this.prismaService.users.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.users
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => userNotExists());
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const passwordHash = generatePasswordHash(updateUserDto.password);

    return await this.prismaService.users
      .update({
        where: { id },
        data: { ...updateUserDto, password: passwordHash },
      })
      .catch((e) => {
        if (e.code === 'P2025') userNotExists();
      });
  }

  async remove(id: number) {
    return await this.prismaService.users
      .delete({ where: { id } })
      .catch((e) => {
        if (e.code === 'P2025') userNotExists();
      });
  }
}
