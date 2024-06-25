

export class UpdateRepairDto {

  private constructor(
    public readonly status: string
  ) { }

  static create(object: { [key: string]: any }): [string?, UpdateRepairDto?] {
    const { status } = object

    if (!status) return ['Missing status', undefined]

    return [undefined, new UpdateRepairDto(status)]
  }
}