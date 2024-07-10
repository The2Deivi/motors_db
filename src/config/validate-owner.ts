

export const protectAccountOwner = (ownerUser: number, sessionUser: number): boolean => {
  if (ownerUser !== sessionUser) {
    return false
  }
  return true
}