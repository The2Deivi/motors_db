import "reflect-metadata"
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { PostgresDatabase } from "./data";
import { envs } from "./config/env";


(async () => {
  main()
})()

async function main() {
  
  //postgresql://motorsdd_owner:nK5GLbkJ2Uwd@ep-summer-voice-a5q48mkv.us-east-2.aws.neon.tech/motorsdd?sslmode=require

  const postgres = new PostgresDatabase({
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    database: envs.DB_DATABASE
  })

  await postgres.connect()

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  })

  await server.start()
}