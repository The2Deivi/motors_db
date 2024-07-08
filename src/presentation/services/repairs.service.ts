import { Repairs } from "../../data"
import { CreateRepairDto, CustomError, UpdateRepairDto } from "../../domain"
import { UserService } from "./user.service"


enum Status {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export class RepairsService {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  async createRepair(createRepairDto: CreateRepairDto) {

    const userPromise = this.userService.findOneUserById(createRepairDto.userId)

    await Promise.all([userPromise])

    const repair = new Repairs()

    repair.date = createRepairDto.date
    repair.status = Status.PENDING
    repair.userid = createRepairDto.userId

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

  async updateRepair(createRepairDto: UpdateRepairDto, id: number) {

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