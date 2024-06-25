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
}