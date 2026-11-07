import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async updateProfile(userId: string, data: Partial<{
    fullName: string;
    phone: string;
    address: string;
    province: string;
    city: string;
    avatarUrl: string;
    cbu: string;
    alias: string;
    accountHolder: string;
  }>) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
