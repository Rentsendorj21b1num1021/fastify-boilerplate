import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.model'
import { config } from '../config'
import { RegisterInput, LoginInput } from '../schemas/auth.schema'

export async function register(data: RegisterInput) {
  const existing = await UserModel.findOne({ email: data.email })
  if (existing) throw { statusCode: 409, message: 'Email бүртгэлтэй байна' }

  const user = await UserModel.create(data)
  return { id: user._id, name: user.name, email: user.email }
}

export async function login(data: LoginInput) {
  const user = await UserModel.findOne({ email: data.email })
  if (!user) throw { statusCode: 401, message: 'Email эсвэл нууц үг буруу' }

  const valid = await user.comparePassword(data.password)
  if (!valid) throw { statusCode: 401, message: 'Email эсвэл нууц үг буруу' }

  const accessToken = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })

  const refreshToken = jwt.sign({ id: user._id }, config.refreshToken.secret, {
    expiresIn: config.refreshToken.expiresIn,
  })

  user.refreshToken = refreshToken
  await user.save()

  return { accessToken, refreshToken }
}

export async function refresh(token: string) {
  let payload: any
  try {
    payload = jwt.verify(token, config.refreshToken.secret)
  } catch {
    throw { statusCode: 401, message: 'Refresh token хүчингүй' }
  }

  const user = await UserModel.findById(payload.id)
  if (!user || user.refreshToken !== token) {
    throw { statusCode: 401, message: 'Refresh token хүчингүй' }
  }

  const accessToken = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })

  return { accessToken }
}

export async function logout(userId: string) {
  await UserModel.findByIdAndUpdate(userId, { refreshToken: null })
}
