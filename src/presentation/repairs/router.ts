import { Router } from "express";
import { RepairsController } from "./controller";
import { RepairsService } from "../services/repairs.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class RepairsRoutes {

  static get routes(): Router {
    const router = Router()

    const repairService = new RepairsService()
    const controller = new RepairsController(repairService)

    router.use(AuthMiddleware.protect)

    router.get('/', controller.findAllRepairs)
    router.post('/', controller.createRepair)
    router.get('/:id', controller.findOneRepair)
    router.patch('/:id', controller.updateRepair)
    router.delete('/:id', controller.deleteRepair)

    return router
  }
}