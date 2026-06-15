import { prisma } from "@/server/db";
import { BaseRepository } from "@/repositories/base-repository";

export type UserRecord = {
  id: string;
  name?: string | null;
  email: string;
};

export class UserRepository extends BaseRepository<UserRecord> {
  async create(data: Partial<UserRecord>): Promise<UserRecord> {
    return prisma.user.create({
      data: {
        email: data.email ?? "",
        name: data.name,
      },
    });
  }

  async findById(id: string): Promise<UserRecord | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}