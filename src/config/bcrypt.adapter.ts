import { genSaltSync, hashSync } from 'bcryptjs'

// de esta manera se encripta la contraseña
export const bcryptAdapter = {

  hash: (password: string) => {
    const salt = genSaltSync(12) // valor por defecto es 10
    return hashSync(password, salt)
  }
}
