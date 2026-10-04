import api from "../services/api";

export async function getApiData<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await api.get<T>(url, { params });
  return response.data;
}

export async function postApiData<TResponse, TBody>(
  url: string,
  body: TBody,
): Promise<TResponse> {
  const response = await api.post<TResponse>(url, body);
  return response.data;
}
