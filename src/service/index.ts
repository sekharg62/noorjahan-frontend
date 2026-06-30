import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { clearAuthSession, tokenStorage } from "@/lib/auth-storage";

export { tokenStorage } from "@/lib/auth-storage";

function getApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    ""
  );
}

export type ApiRequestConfig = AxiosRequestConfig & {
  /** When true, skips attaching the auth token even on apiClient. */
  skipAuth?: boolean;
};

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

function attachAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const skipAuth = (config as ApiRequestConfig).skipAuth;

    if (!skipAuth) {
      const token = tokenStorage.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearAuthSession();
      }
      return Promise.reject(error);
    },
  );
}

function createAxiosInstance(withAuth: boolean): AxiosInstance {
  const instance = axios.create({
    baseURL: getApiUrl(),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (withAuth) {
    attachAuthInterceptor(instance);
  }

  return instance;
}

const publicClient = createAxiosInstance(false);
const authClient = createAxiosInstance(true);

async function request<T>(
  method: HttpMethod,
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: ApiRequestConfig,
): Promise<T> {
  let response: AxiosResponse<T>;

  switch (method) {
    case "get":
      response = await client.get<T>(url, config);
      break;
    case "delete":
      response = await client.delete<T>(url, config);
      break;
    case "post":
      response = await client.post<T>(url, data, config);
      break;
    case "put":
      response = await client.put<T>(url, data, config);
      break;
    case "patch":
      response = await client.patch<T>(url, data, config);
      break;
  }

  return response.data;
}

function createApiMethods(client: AxiosInstance) {
  return {
    get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
      return request<T>("get", client, url, undefined, config);
    },

    post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
      return request<T>("post", client, url, data, config);
    },

    put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
      return request<T>("put", client, url, data, config);
    },

    patch<T>(
      url: string,
      data?: unknown,
      config?: ApiRequestConfig,
    ): Promise<T> {
      return request<T>("patch", client, url, data, config);
    },

    delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
      return request<T>("delete", client, url, undefined, config);
    },
  };
}

/** Public API calls — no Authorization header is sent. */
export const publicApi = createApiMethods(publicClient);

/**
 * Authenticated API client — sends `Authorization: Bearer <token>` when a
 * token exists in localStorage. Use for protected routes (profile, orders, etc.).
 */
export const apiClient = createApiMethods(authClient);

export type ApiClient = typeof apiClient;
