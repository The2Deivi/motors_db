import { Router } from "express";
import { RepairsRoutes } from "./repairs/router";
import { UsersRoutes } from "./auth/router";


export class AppRoutes {

  static get routes(): Router {
    const router = Router()

    router.use('/api/v1/auth', UsersRoutes.routes)
    router.use('/api/v1/repairs', RepairsRoutes.routes)

    return router
  }
}