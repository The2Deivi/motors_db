import { Repairs } from "../../data"
import { CreateRepairDto, CustomError } from "../../domain"


enum Status {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export class RepairsService {

  constructor() {
  }

  async createRepair(repairData: CreateRepairDto) {
    const repair = new Repairs()

    repair.date = repairData.date
    repair.status = Status.PENDING
    repair.userid = repairData.userId

    try {
      return await repair.save()
    } catch (error: any) {
      throw CustomError.internalServer('Internal Server Error')
    }
  }

  async findAllRepairs() {

    try {
      return await Repairs.find({
        where: {
          status: Status.PENDING
        }
      })
    } catch (error: any) {
      throw CustomError.internalServer('Internal Server Error')
    }
  }

  async findOneRepairById(id: number) {

    const repair = await Repairs.findOne({
      where: {
        id: id,
        status: Status.PENDING
      }
    })

    if (!repair) {
      throw CustomError.notFound(`Motorcicle with id ${id} not found`)
    }

    return repair

  }

  async updateRepair(repairData: any, id: number) {

    const repair = await this.findOneRepairById(id)

    repair.status = Status.COMPLETED

    try {
      return await repair.save()
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong')
    }
  }

  async deleteRepair(id: number) {
    const repair = await this.findOneRepairById(id)

    repair.status = Status.CANCELLED

    try {
      await repair.save()
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong')
    }
  }
}