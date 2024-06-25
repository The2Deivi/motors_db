import { Users } from "../../data"
import { CustomError } from "../../domain"

enum Status {
  AVAILABLE = 'AVAILABLE',
  DISABLED = 'DISABLED'
}

enum Role {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE'
}

export class UserService {

  constructor() {
  }

  async createUser(userData: any) {
    const user = new Users()

    user.name = userData.name.toLowerCase().trim()
    user.email = userData.email.toLowerCase().trim()
    user.password = userData.password.trim()
    user.role = Role.CLIENT

    try {
      return await user.save()
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error')
    }
  }

  async findAllUsers() {

    try {
      return await Users.find()
    } catch (error: any) {
      throw CustomError.internalServer('Internal Server Error')
    }
  }

  async findOneUserById(id: number) {

    const user = await Users.findOne({
      where: {
        id: id,
        status: Status.DISABLED
      }
    })

    if (!user) {
      throw CustomError.notFound(`User with id ${id} not found`)
    }

    return user

  }

  async updateUser(userData: any, id: number) {

    const user = await this.findOneUserById(id)

    user.name = userData.name.toLowerCase().trim()
    user.email = userData.email.toLowerCase().trim()

    try {
      return await user.save()
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong')
    }
  }

  async deleteUser(id: number) {
    const user = await this.findOneUserById(id)

    user.status = Status.DISABLED

    try {
      await user.save()
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong')
    }
  }
}