import axios from 'axios'
import { useUserStore } from '~/store/user'
// import { useLoginStore } from '~/stores/login'

const isLoginRequest = (requestUrl?: string) => {
    return Boolean(requestUrl?.includes('/auth/login'))
}

export const useAxios = () => {
    // const loginStore = useLoginStore()

    const baseURL = useApiBaseUrl()

    const api = axios.create({
        baseURL,
    })

    // Add request interceptor to add token to headers
    api.interceptors.request.use(
        (config) => {
            const token = useUserStore().token
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401 && !isLoginRequest(error.config?.url)) {
                const userStore = useUserStore()
                await userStore.logout()
                if (process.client) {
                    const router = useNuxtApp().$router
                    const currentRoute = router?.currentRoute?.value

                    if (router && currentRoute?.path !== '/login') {
                        router.push({ path: '/login', query: { redirect: currentRoute?.fullPath || '/' } })
                    }
                }
            }
            return Promise.reject(error)
        }
    )
    // Inject the api instance into the Nuxt app
    // Return the api instance
    return api
}
