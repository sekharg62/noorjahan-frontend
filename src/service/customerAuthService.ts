import { publicApi } from "@/service";

const REGISTER_ENDPOINT = "/api/customers/auth/register";
const LOGIN_ENDPOINT = "/api/customers/auth/login";

export function buildLoginPayload(params: {
  phoneLocal: string;
  password: string;
}): any {
  return {
    phone: params.phoneLocal,
    password: params.password,
  };
}

export function buildRegisterPayload(params: {
  firstName: string;
  lastName: string;
  phoneLocal: string;
  email?: string;
  password: string;
}): any {
  const name = [params.firstName, params.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

  const payload: any = {
    name,
    phone: params.phoneLocal,
    password: params.password,
  };

  if (params.email) {
    payload.email = params.email;
  }

  return payload;
}

export const customerAuthService = {
  register(payload: any): Promise<any> {
    return publicApi.post<any>(REGISTER_ENDPOINT, payload);
  },

  login(payload: any): Promise<any> {
    return publicApi.post<any>(LOGIN_ENDPOINT, payload);
  },
};

export function parseAuthResponse(
  response: any,
): { token: string; customer: any } | null {
  const token = response?.data?.token ?? response?.token;
  const customer = response?.data?.customer ?? response?.customer;

  if (!token || !customer?.id) return null;

  return { token, customer };
}
