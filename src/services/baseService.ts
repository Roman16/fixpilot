import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import toast from 'react-hot-toast';
import ROUTES from "@/config/routes";
import authService from "@/services/authService";

export class baseService {
    protected api: AxiosInstance;

    constructor(baseURL: string = '/api') {

        this.api = axios.create({
            baseURL,
            withCredentials: true,
        });

        this.api.interceptors.response.use(
            (res) => res,
            (error) => {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.message || 'Сталась помилка';

                const url = error.config?.url;
                const isAuthRequest = url?.includes('/login') || url?.includes('/registration');

                if (status === 401 && !isAuthRequest) {
                    toast.error('Сесія закінчилась. Увійдіть знову');
                    authService.logout()
                        .then(() => window.location.href = ROUTES.LOGIN)
                } else {
                    toast.error(message);
                }

                return Promise.reject(new Error(message));
            }
        );
    }

    protected async request<T>(promise: Promise<{ data: T }>): Promise<T> {
        try {
            const response = await promise;
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    protected get<T>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>(this.api.get(url, config));
    }

    protected post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        const headers = data instanceof FormData ? {} : {'Content-Type': 'application/json'};
        return this.request<T>(this.api.post(url, data, {...config, headers}));
    }

    protected put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>(this.api.put(url, data, config));
    }

    protected patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>(this.api.patch(url, data, config));
    }

    protected delete<T>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>(this.api.delete(url, config));
    }
}
