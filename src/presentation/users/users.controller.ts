import { Request, Response } from "express"
import { UserService } from "../services/user.service"
import { error } from "console"


export class UsersController {

  constructor(
    private readonly userService: UserService
  ){

  }

  createUser = (req: Request, res: Response) => {
    const { name, email, password, role } = req.body

    this.userService.createUser({ name, email, password, role })
      .then((user) => {
        res.status(201).json(user)
      })
      .catch((error) => {
        res.status(500).json(error)
      });
  }

  findAllUsers = (req: Request, res: Response) => {
    res.status(200).json({ message: 'ok' })
  }

  findOneUser = (req: Request, res: Response) => {
    const { id } = req.params

    return res.status(200).json({
      message: `Usuario con id ${id} listado`
    })
  }

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params
    const { name, price, description } = req.body

    return res.status(200).json({
      message: `Usuario con id ${id} actualizado`
    })
  }
  
  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params

    return res.status(204).json({
      message: `Usuario con id ${id} eliminado`
    })
  }
}