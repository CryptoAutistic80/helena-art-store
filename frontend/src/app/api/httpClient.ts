const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export const request = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${baseUrl}${input}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};
