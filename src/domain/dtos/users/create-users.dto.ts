

export class CreateUserDto {

  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) { }

  static create(object: { [key: string]: any }): [string?, CreateUserDto?] {
    const { name, email, password } = object

    if (!name) return ['Missing name', undefined]
    if (!email) return ['Missing userId']
    if (!password) return['Missing password']

    return [undefined, new CreateUserDto(name, email, password)]
  }
}