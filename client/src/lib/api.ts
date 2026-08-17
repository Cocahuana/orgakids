export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const TOKEN_KEY = "orgafamy_token";

/** Fired when the API rejects the stored token so `useAuth` can drop the session. */
export const UNAUTHORIZED_EVENT = "orgafamy:unauthorized";

export class ApiError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
	method: string,
	path: string,
	body?: unknown,
): Promise<T> {
	const token = getToken();

	let response: Response;
	try {
		response = await fetch(`${API_URL}/api${path}`, {
			method,
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	} catch {
		throw new ApiError(0, "No se pudo conectar con el servidor");
	}

	if (response.status === 204) return undefined as T;

	const data = await response.json().catch(() => null);

	if (!response.ok) {
		if (response.status === 401) {
			clearToken();
			window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
		}
		const message =
			(data as { error?: string } | null)?.error ??
			`Error ${response.status}`;
		throw new ApiError(response.status, message);
	}

	return data as T;
}

export const api = {
	get: <T>(path: string) => request<T>("GET", path),
	post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
	put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
	delete: <T = void>(path: string) => request<T>("DELETE", path),
};
