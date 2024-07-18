import { bcryptAdapter, envs } from "../../config"
import { JwtAdapter } from "../../config/jwt.adapter"
import { Users } from "../../data"
import { RegisterUserDto, CustomError, UpdateUserDto, LoginUserDto } from "../../domain"
import { EmailService } from "./email.service"

enum Status {
  AVAILABLE = 'AVAILABLE',
  DISABLED = 'DISABLED'
}

enum Role {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE'
}

export class UserService {

  constructor(
    private readonly emailService: EmailService
  ) {
  }

  public async createUser(registerUserDto: RegisterUserDto) {
    const existerUser = await Users.findOne({
      where: {
        status: Status.AVAILABLE,
        email: registerUserDto.email
      }
    })

    if (existerUser) throw CustomError.badRequest('Email already exists')

    const user = new Users()
    user.name = registerUserDto.name
    user.email = registerUserDto.email
    user.password = registerUserDto.password


    try {
      await user.save()

      await this.sendEmailValidationLink(user.email)

      const token = await JwtAdapter.generateToken({ id: user.id })
      if (!token) throw CustomError.internalServer('Error while generating JWT token')

      return {
        user,
        //token,
      }

    } catch (error: any) {
      throw CustomError.internalServer(error)
    }
  }

  public async login(loginUserDto: LoginUserDto) {
    // 1. Buscar que exista el usuario
    const user = await Users.findOne({
      where: {
        email: loginUserDto.email,
        status: Status.AVAILABLE,
        emailValidated: true
      }
    })
    if (!user) throw CustomError.unAuthorized('Invalid credentials')
    // 2. Validar la contraseña
    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password)
    if (!isMatching) throw CustomError.unAuthorized('Invalid credentials')
    // 3. Generar el token
    const token = await JwtAdapter.generateToken({ id: user.id })
    if (!token) throw CustomError.internalServer('Error while creating JWT')
    // 4. enviar información del usuario al cliente
    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    }
  }

  public async getProfile(id: number) {
    const user = await Users.findOne({
      where: {
        id: id,
        status: Status.AVAILABLE
      },
      relations: ['repairs', 'repairs.user'],
      select: {
        repairs: {
          motorsNumber: true,
          description: true,
          status: true,
          date: true
        }
      }
    })

    if (!user) throw CustomError.notFound('User not found')

    return user
  }

  public sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email })
    if (!token) throw CustomError.internalServer('Error getting token')

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`
    const html = `
        <h1>Validate your email</h1>
        <p>Click the link below to validate your email</p>
        <a href="${link}">Validate your email: ${email}</a>
      `

    const isSent = this.emailService.sendEmail({
      to: email,
      subject: 'Validate your email',
      htmlBody: html
    })
    if (!isSent) throw CustomError.internalServer('Error sending email')

    return true
  }

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token)
    if (!payload) throw CustomError.unAuthorized('Invalid token')

    const { email } = payload as { email: string }
    if (!email) throw CustomError.internalServer('Email not in token')

    const user = await Users.findOne({
      where: {
        email: email
      }
    })
    if (!user) throw CustomError.internalServer('Email not exist')

    user.emailValidated = true
    try {
      await user.save()

      return true
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong')
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

  async updateUser(userData: UpdateUserDto, id: number) {

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