import { UserModel } from '../models/user.model'
import { UpdateUserInput } from '../schemas/user.schema'

export async function getUserById(id: string) {
  const user = await UserModel.findById(id).select('-password -refreshToken')
  if (!user) throw { statusCode: 404, message: 'User олдсонгүй' }
  return user
}

export async function getAllUsers(page: number, limit: number) {
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    UserModel.find().select('-password -refreshToken').skip(skip).limit(limit),
    UserModel.countDocuments(),
  ])
  return { users, total, page, limit }
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const user = await UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password -refreshToken')
  if (!user) throw { statusCode: 404, message: 'User олдсонгүй' }
  return user
}

export async function deleteUser(id: string) {
  const user = await UserModel.findByIdAndDelete(id)
  if (!user) throw { statusCode: 404, message: 'User олдсонгүй' }
}
