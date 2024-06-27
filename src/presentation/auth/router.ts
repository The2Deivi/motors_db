import { Router } from "express";
import { UsersController } from "./users.controller";
import { UserService } from "../services/user.service";


export class UsersRoutes {

  static get routes(): Router {
    const router = Router()

    const userService = new UserService()
    const controller = new UsersController(userService)

    router.post('/login', controller.login)
    router.post('/register', controller.register)
    router.get('/', controller.findAllUsers)
    router.post('/', controller.createUser)
    router.get('/:id', controller.findOneUser)
    router.patch('/:id', controller.updateUser)
    router.delete('/:id', controller.deleteUser)

    return router
  }
}