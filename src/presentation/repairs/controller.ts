import { Request, Response } from "express"
import { RepairsService } from "../services/repairs.service"
import { CreateRepairDto, CustomError } from "../../domain"


export class RepairsController {

  constructor(
    private readonly repairService: RepairsService
  ) { }

  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    console.log(error)
    return res.status(500).json({ message: 'Something went very wrong' })
  }

  createRepair = (req: Request, res: Response) => {
    const [error, createRepairDto] = CreateRepairDto.create(req.body)
    if (error) return res.status(422).json({ message: error })

    this.repairService.createRepair(createRepairDto!)
      .then(repair => res.status(201).json(repair))
      .catch((error: any) => this.handleError(error, res))
  }

  findAllRepairs = (req: Request, res: Response) => {

    this.repairService.findAllRepairs()
      .then(repairs => res.status(200).json(repairs))
      .catch((error: any) => this.handleError(error, res))
  }

  findOneRepair = (req: Request, res: Response) => {
    const { id } = req.params
    if (isNaN(+id)) {
      res.status(400).json({ message: 'El id debe ser numerico' })
    }

    this.repairService.findOneRepairById(+id)
      .then(repair => res.status(200).json(repair))
      .catch((error: any) => this.handleError(error, res))
  }

  updateRepair = (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.body

    if (isNaN(+id)) {
      res.status(400).json({ message: 'El id debe ser numerico' })
    }

    this.repairService.updateRepair({ status }, +id)
      .then(repair => res.status(200).json(repair))
      .catch((error: any) => res.status(500).json(error))
  }

  deleteRepair = (req: Request, res: Response) => {
    const { id } = req.params

    if (isNaN(+id)) {
      return res.status(400).json({ message: 'El id debe se un numero' })
    }

    this.repairService.deleteRepair(+id)
      .then(() => res.status(204).json())
      .catch((error: any) => res.status(500).json(error))
  }
}