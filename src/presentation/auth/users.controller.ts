import { Request, Response } from "express"
import { UserService } from "../services/user.service"
import { RegisterUserDto, CustomError, UpdateUserDto } from "../../domain"
import { LoginUserDto } from "../../domain/dtos/users/login-users.dto"


export class UsersController {

  constructor(
    private readonly userService: UserService
  ) { }

  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    console.log(error)
    return res.status(500).json({ message: 'Something went very wrong' })
  }

  register = async (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body)
    if (error) return res.status(422).json({ message: error })

    this.userService.createUser(registerUserDto!, req.file)
      .then(data => res.status(200).json(data))
      .catch((error) => this.handleError(error, res))
  }

  login = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body)
    if (error) return res.status(422).json({ message: error })

    this.userService.login(loginUserDto!)
      .then(data => res.status(200).json(data))
      .catch((error) => this.handleError(error, res))
  }

  validateEmail = async (req: Request, res: Response) => {
    const { token } = req.params

    this.userService.validateEmail(token)
      .then(() => res.json('Email was validated properly'))
      .catch((error) => this.handleError(error, res))

  }

  getProfile = async (req: Request, res: Response) => {
    const { id } = req.body.sessionUser

    this.userService.getProfile(+id)
      .then(data => res.status(200).json(data))
      .catch((error) => this.handleError(error, res))
  }

  findAllUsers = (req: Request, res: Response) => {

    this.userService.findAllUsers()
      .then(users => res.status(200).json(users))
      .catch((error: any) => this.handleError(error, res))
  }

  findOneUser = (req: Request, res: Response) => {
    const { id } = req.params
    if (isNaN(+id)) {
      res.status(400).json({ message: 'El id debe ser numerico' })
    }

    this.userService.findOneUserById(+id)
      .then(user => res.status(200).json(user))
      .catch((error: any) => this.handleError(error, res))
  }

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params
    const [error, updateUserDto] = UpdateUserDto.create(req.body)

    if (isNaN(+id)) {
      res.status(400).json({ message: 'El id debe ser numerico' })
    }

    if (error) return res.status(422).json({ message: error })

    this.userService.updateUser(updateUserDto!, +id)
      .then(user => res.status(200).json(user))
      .catch((error: any) => res.status(500).json(error))
  }

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params

    if (isNaN(+id)) {
      return res.status(400).json({ message: 'El id debe se un numero' })
    }

    this.userService.deleteUser(+id)
      .then(() => res.status(204).json({ message: `Usuario con id ${id} eliminado` }))
      .catch((error: any) => res.status(500).json(error))
  }
}