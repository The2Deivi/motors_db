import { Request, Response } from "express"
import { UserService } from "../services/user.service"
import { CreateUserDto, CustomError, UpdateUserDto } from "../../domain"


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

  createUser = (req: Request, res: Response) => {
    const [error, createUserDto] = CreateUserDto.create(req.body)
    if (error) return res.status(422).json({ message: error })

    this.userService.createUser(createUserDto!)
      .then((user) => res.status(201).json(user))
      .catch((error: any) => this.handleError(error, res))
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