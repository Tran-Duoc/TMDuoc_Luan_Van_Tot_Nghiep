import bcrypt from 'bcrypt'

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    throw new Error(error)
  }
}

// Function to compare a password with its hash
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    throw new Error(error)
  }
}
