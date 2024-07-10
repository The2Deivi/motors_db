import e, { Router } from "express";
import { RepairsController } from "./controller";
import { RepairsService } from "../services/repairs.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";

enum Role {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE'
}
export class RepairsRoutes {

  static get routes(): Router {
    const router = Router()

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    )

    const userService = new UserService(emailService)

    const repairService = new RepairsService(userService)
    const controller = new RepairsController(repairService)

    router.use(AuthMiddleware.protect)

    router.get('/', AuthMiddleware.restrictTo(Role.EMPLOYEE), controller.findAllRepairs)
    router.post('/', controller.createRepair)
    router.get('/:id', controller.findOneRepair)
    router.patch('/:id', controller.updateRepair)
    router.delete('/:id', controller.deleteRepair)

    return router
  }
}