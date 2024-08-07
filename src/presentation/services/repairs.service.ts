import { protectAccountOwner } from "../../config/validate-owner"
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

    const [user] = await Promise.all([userPromise])

    const repair = new Repairs()

    repair.date = createRepairDto.date
    repair.status = Status.PENDING
    repair.user = user

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
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    })

    if (!repair) {
      throw CustomError.notFound(`Motorcicle with id ${id} not found`)
    }

    return repair

  }

  async updateRepair(updateRepairDto: UpdateRepairDto, id: number) {

    const repair = await this.findOneRepairById(id)

    repair.status = Status.COMPLETED

    try {
      return await repair.save()
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong')
    }
  }

  async deleteRepair(id: number, userSessionId: number) {
    const repair = await this.findOneRepairById(id)

    const isOwner = protectAccountOwner(repair.user.id, userSessionId)
    if (!isOwner) throw CustomError.unAuthorized('You are not the owner of this repair')

    repair.status = Status.CANCELLED

    try {
      return await repair.save()
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong')
    }
  }
}