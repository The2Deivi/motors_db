import { regularExp } from "../../../config"


export class RegisterUserDto {

  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) { }

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object

    if (!name) return ['Missing name', undefined]
    if (!email) return ['Missing email']
    if (!regularExp.email.test(email)) return ['Invalid email']
    if (!password) return ['Missing password']
    if (!regularExp.password.test(password)) return ['Invalid password! minimum 10 characters, maximum 15 characters']

    return [undefined, new RegisterUserDto(name, email, password)]
  }
}