import axios from 'axios'
import { BASE_URL } from '../my-env'

const apiManager = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

export default apiManager
