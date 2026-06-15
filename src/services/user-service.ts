import { UserRepository } from "@/repositories/user-repository";

const userRepository = new UserRepository();

export const userService = {
  getById: (id: string) => userRepository.findById(id),
};