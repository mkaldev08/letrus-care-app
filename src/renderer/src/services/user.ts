import { AxiosResponse } from 'axios'
import apiMananger from './api'

export interface IAuth {
  _id?: string
  username: string
  password: string
  phoneNumber?: string
  role?: string
}

export const signupService = async (data: IAuth): Promise<number> => {
  const { username, password, role, phoneNumber } = data
  try {
    const { status } = await apiMananger.post('/users/new', {
      username,
      password,
      phoneNumber,
      role
    })
    return status
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const loginService = async ({ username, password }: IAuth): Promise<AxiosResponse> => {
  try {
    const response = await apiMananger.post('/users/login', {
      username,
      password
    })

    return response
  } catch (error) {
    console.log('erro no login: ', error)
    throw error
  }
}

export const logoutService = async (): Promise<void> => {
  try {
    await apiMananger.post('/users/logout')
  } catch (error) {
    console.log(error)
  }
}

export const findUserService = async (username: string): Promise<string> => {
  try {
    const { data } = await apiMananger.get(`/users/find/${username}`)
    localStorage.setItem('reqUserId', data.user._id)
    return data.user._id
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const verifyOTPService = async (reqOTP: string, userId: string): Promise<number> => {
  try {
    const { status } = await apiMananger.post(`/users/verify/${userId}`, reqOTP)
    return status
  } catch (error) {
    console.log(error)
    return -1
  }
}
