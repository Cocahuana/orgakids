import { useCallback, useEffect, useState } from "react";
import type { AuthUser, Family } from "../types";
import {
	api,
	clearToken,
	getToken,
	setToken,
	UNAUTHORIZED_EVENT,
} from "../lib/api";

interface AuthResponse {
	token: string;
	user: AuthUser;
	family: Family;
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	familyName?: string;
	inviteCode?: string;
}

export function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [family, setFamily] = useState<Family | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!getToken()) {
			setLoading(false);
			return;
		}

		let cancelled = false;

		api.get<{ user: AuthUser; family: Family }>("/auth/me")
			.then((session) => {
				if (cancelled) return;
				setUser(session.user);
				setFamily(session.family);
			})
			.catch(() => clearToken())
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const handleUnauthorized = () => {
			setUser(null);
			setFamily(null);
		};
		window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
		return () =>
			window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
	}, []);

	const applySession = useCallback((session: AuthResponse) => {
		setToken(session.token);
		setUser(session.user);
		setFamily(session.family);
	}, []);

	const login = useCallback(
		async (email: string, password: string) => {
			applySession(
				await api.post<AuthResponse>("/auth/login", {
					email,
					password,
				}),
			);
		},
		[applySession],
	);

	const register = useCallback(
		async (payload: RegisterPayload) => {
			applySession(
				await api.post<AuthResponse>("/auth/register", payload),
			);
		},
		[applySession],
	);

	const logout = useCallback(() => {
		clearToken();
		setUser(null);
		setFamily(null);
	}, []);

	return { user, family, loading, login, register, logout };
}
