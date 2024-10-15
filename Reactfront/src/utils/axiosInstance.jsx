import axios from 'axios'
import authService from './authService'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = authService.getAccessToken()

    if (token && authService.isTokenExpired(token)) {
      token = await authService.refreshToken()
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance

// import axios from 'axios'
// import { jwtDecode } from 'jwt-decode'
// import dayjs from 'dayjs'

// const BASE_URL = 'http://localhost:8000/api/v1'

// export function useAxiosInstance () {
//   const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true
//   })

//   axiosInstance.interceptors.request.use(
//     async (request) => {
//       if (request.url.includes('token/') || !accessToken) {
//         return request
//       }
//       if (!refreshToken || dayjs().isAfter(jwtDecode(refreshToken).exp * 1000)) {
//         setAccessToken(null)
//         console.log('Sesión expirada')
//         console.log(refreshToken)
//         return request
//       }
//       const isExpired = dayjs().isAfter(jwtDecode(accessToken).exp * 1000)
//       if (isExpired) {
//         const data = {
//           refresh: refreshToken
//         }
//         const response = await axios.post(`${BASE_URL}/token/refresh/`, data)
//         if (response.status === 200) {
//           setAccessToken(response.data.access)
//           request.headers.Authorization = `Bearer ${response.data.access}`
//         }
//       } else {
//         request.headers.Authorization = accessToken ? `Bearer ${accessToken}` : ''
//       }
//       return request
//     }
//   )

//   axiosInstance.interceptors.response.use(
//     async (response) => {
//       // si se solicita un token y la respuesta es 200
//       if (response.config.url.includes('token/') && response.status === 200) {
//         setAccessToken(response.data.access)
//         axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.access}`
//         if (response.data.refresh) {
//           setRefreshToken(response.data.refresh)
//         }
//       }

//       return response
//     }
//   )

//   return axiosInstance
// }
