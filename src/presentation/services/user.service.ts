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

    const repair = await Users.findOne({
      where: {
        id: id,
        status: Status.DISABLED
      }
    })

    if (!repair) {
      throw CustomError.notFound(`User with id ${id} not found`)
    }

    return repair

  }
}