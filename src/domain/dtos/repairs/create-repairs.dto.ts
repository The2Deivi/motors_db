

export class CreateRepairDto {

  private constructor(
    public readonly date: string,
    public readonly userId: number
  ) { }

  static create(object: { [key: string]: any }): [string?, CreateRepairDto?] {
    const { date, userId } = object

    if (!date) return ['Missing date', undefined]
    if (!userId) return ['Missing userId']

    return [undefined, new CreateRepairDto(date, userId)]
  }
}