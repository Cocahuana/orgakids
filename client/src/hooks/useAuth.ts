import { useCallback, useEffect, useState } from "react";
import type { AuthUser, Family, ScopeOption } from "../types";
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
	families?: Family[];
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
	const [scopes, setScopes] = useState<ScopeOption[]>([]);
	const [selectedScopeId, setSelectedScopeId] = useState<string>("personal");
	const [loading, setLoading] = useState(true);

	const syncScopes = useCallback(
		(session: { user: AuthUser; family: Family; families?: Family[] }) => {
			const nextScopes: ScopeOption[] = [
				{ id: "personal", name: session.user.name, kind: "personal" },
				...(session.families ?? []).map((item) => ({
					id: item.id,
					name: item.name,
					kind: "family" as const,
				})),
			];
			setScopes(nextScopes);
			setSelectedScopeId((current) => {
				if (
					current &&
					nextScopes.some((scope) => scope.id === current)
				) {
					return current;
				}
				return nextScopes[0]?.id ?? "personal";
			});
		},
		[],
	);

	useEffect(() => {
		if (!getToken()) {
			setLoading(false);
			return;
		}

		let cancelled = false;

		api.get<{ user: AuthUser; family: Family; families?: Family[] }>(
			"/auth/me",
		)
			.then((session) => {
				if (cancelled) return;
				setUser(session.user);
				setFamily(session.family);
				syncScopes(session);
			})
			.catch(() => clearToken())
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [syncScopes]);

	useEffect(() => {
		const handleUnauthorized = () => {
			setUser(null);
			setFamily(null);
			setScopes([]);
			setSelectedScopeId("personal");
		};
		window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
		return () =>
			window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
	}, []);

	const applySession = useCallback(
		(session: AuthResponse) => {
			setToken(session.token);
			setUser(session.user);
			setFamily(session.family);
			syncScopes(session);
		},
		[syncScopes],
	);

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
		setScopes([]);
		setSelectedScopeId("personal");
	}, []);

	const selectedScope =
		scopes.find((scope) => scope.id === selectedScopeId) ??
		scopes[0] ??
		(user
			? { id: "personal", name: user.name, kind: "personal" as const }
			: null);

	return {
		user,
		family,
		scopes,
		selectedScope,
		setSelectedScopeId,
		loading,
		login,
		register,
		logout,
	};
}
