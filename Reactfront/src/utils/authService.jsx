import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'

const API_URL = 'http://localhost:8000/token/'
const REFRESH_URL = `${API_URL}refresh/`

let isRrefreshing = false
let refreshSubscribers = []

const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken))
}

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

const login = async (run, password) => {
  const response = await axios.post(API_URL, { run, password })
  if (response.data.access) {
    setTokens(response.data.access, response.data.refresh)
  }
  return response.data
}

const logout = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
}

const setTokens = (accessToken, refreshToken) => {
  Cookies.set('access_token', accessToken, { secure: false, sameSite: 'Strict' })
  Cookies.set('refresh_token', refreshToken, { secure: false, sameSite: 'Strict' })
}

const getAccessToken = () => {
  return Cookies.get('access_token')
}

const getRefreshToken = () => {
  return Cookies.get('refresh_token')
}

const isTokenExpired = (token) => {
  if (!token) return true
  const { exp } = jwtDecode(token)
  return dayjs.unix(exp).isBefore(dayjs())
}

const refreshToken = async () => {
  if (isRrefreshing) {
    return new Promise((resolve) => {
      addRefreshSubscriber((accessToken) => {
        resolve(accessToken)
      })
    })
  }
  isRrefreshing = true
  const refreshToken = getRefreshToken()
  if (!refreshToken || isTokenExpired(refreshToken)) {
    logout()
    return null
  }

  try {
    const response = await axios.post(REFRESH_URL, { refresh: refreshToken })
    if (response.data.access) {
      setTokens(response.data.access, response.data.refresh)
      onRefreshed(response.data.access)
      isRrefreshing = false
      refreshSubscribers = []
      return response.data.access
    }
  } catch (error) {
    logout()
    isRrefreshing = false
    return null
  }
}

export default { login, logout, getAccessToken, refreshToken, isTokenExpired }
