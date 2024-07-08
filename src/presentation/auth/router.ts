import { Router } from "express";
import { UsersController } from "./users.controller";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class UsersRoutes {

  static get routes(): Router {
    const router = Router()

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    )

    const userService = new UserService(emailService)
    const controller = new UsersController(userService)

    router.post('/login', controller.login)
    router.post('/register', controller.register)
    router.get('/validate-email/:token', controller.validateEmail)
    router.get('/profile', AuthMiddleware.protect, controller.getProfile)
    router.get('/', controller.findAllUsers)
    router.get('/:id', controller.findOneUser)
    router.patch('/:id', controller.updateUser)
    router.delete('/:id', controller.deleteUser)


    return router
  }
}