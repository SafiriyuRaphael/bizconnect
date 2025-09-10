import axios, {
    AxiosResponse,
    CancelTokenSource,
    AxiosRequestTransformer,
    AxiosRequestConfig,
    AxiosError,
    AxiosHeaders,
} from 'axios';
import axiosRetry from 'axios-retry';
import qs from 'qs';
import { getSession } from 'next-auth/react';

// Custom error class for authentication redirects
class AuthRedirectError extends Error {
    status: number;
    redirectTo: string;

    constructor(message: string, status: number, redirectTo: string) {
        super(message);
        this.name = 'AuthRedirectError';
        this.status = status;
        this.redirectTo = redirectTo;
    }
}

// interface CustomAxiosRequestConfig extends AxiosRequestConfig {
//     _retry?: boolean;
// }

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
type ContentType = 'application/json' | 'application/x-www-form-urlencoded';

interface ApiError extends Error {
    status?: number;
    data?: unknown;
}

interface ApiServiceConfig<TBody = unknown> {
    baseUrl?: string;
    endpoint: string;
    method: HttpMethod;
    headers?: AxiosHeaders;
    body?: TBody;
    params?: Record<string, string | number | boolean>;
    timeout?: number;
    contentType?: ContentType;
    transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
    signal?: AbortSignal;
    requiresAuth?: boolean;
}

const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES = 3;

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL

const apiClient = axios.create({
    baseURL: apiUrl,
    timeout: DEFAULT_TIMEOUT,
    headers: new AxiosHeaders({
        'Content-Type': 'application/json',
    }),
    validateStatus: (status) => status >= 200 && status < 500,
});

axiosRetry(apiClient, {
    retries: MAX_RETRIES,
    retryDelay: (retryCount: number) => retryCount * 1000,
    retryCondition: (error: AxiosError) =>
        !error.response || (error.response.status >= 500 && error.response.status <= 599),
});

async function apiService<TResponse, TBody = unknown>({
    baseUrl,
    endpoint,
    method,
    headers = new AxiosHeaders(),
    body,
    params,
    timeout,
    contentType = 'application/json',
    transformRequest,
    signal,
    requiresAuth = false,
}: ApiServiceConfig<TBody>): Promise<{
    response: AxiosResponse<TResponse>;
    cancel: (reason?: string) => void;
}> {
    const source: CancelTokenSource = axios.CancelToken.source();
    signal?.addEventListener('abort', () => {
        source.cancel('Query was cancelled by TanStack Query');
    });

    if (requiresAuth) {
        const session = await getSession();
        if (!session?.user?.id) {
            throw new AuthRedirectError('Authentication required', 401, '/auth/login');
        }
    }

    try {
        const response = await apiClient({
            baseURL: baseUrl || apiClient.defaults.baseURL,
            url: endpoint,
            method,
            headers: new AxiosHeaders({
                'Content-Type': contentType,
                ...(headers?.toJSON?.() || headers),
            }),
            data: contentType === 'application/x-www-form-urlencoded' && body ? qs.stringify(body) : body,
            params,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
            cancelToken: source.token,
            timeout: timeout || DEFAULT_TIMEOUT,
            transformRequest:
                transformRequest ||
                (contentType === 'application/x-www-form-urlencoded'
                    ? [(data) => (typeof data === 'string' ? data : qs.stringify(data))]
                    : undefined),
        });

        if (response.status >= 400) {
            const apiError: ApiError = new Error(
                (response.data as any)?.message || 'Request failed'
            );
            apiError.status = response.status;
            apiError.data = response.data;
            throw apiError;
        }
        return { response, cancel: (reason?: string) => source.cancel(reason) };
    } catch (error) {
        if (axios.isCancel(error)) {
            throw error;
        }
        if (axios.isAxiosError(error)) {

            const status = error.response?.status;

            if (status === 401) {
                throw new AuthRedirectError(
                    (error.response?.data as any)?.message || 'Unauthorized',
                    401,
                    '/auth/login'
                );
            }


            if (error.code === 'ECONNABORTED') {
                error.message = 'The request took too long. Please try again later.';
            }

            const apiError: ApiError = new Error(error.message || 'Request failed');
            apiError.status = error.response?.status;
            apiError.data = error.response?.data;
            throw apiError;
        }
        throw error; // Throw AuthRedirectError or other errors
    }
}

export default apiService;