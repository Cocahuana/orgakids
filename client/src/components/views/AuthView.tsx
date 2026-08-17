import { useState, type FormEvent } from "react";
import type { RegisterPayload } from "../../hooks/useAuth";
import styles from "./AuthView.module.css";

type Mode = "login" | "register";
type Feedback = {
	kind: "success" | "error";
	message: string;
} | null;

interface AuthViewProps {
	onLogin: (email: string, password: string) => Promise<void>;
	onRegister: (payload: RegisterPayload) => Promise<void>;
}

export function AuthView({ onLogin, onRegister }: AuthViewProps) {
	const [mode, setMode] = useState<Mode>("login");
	const [joinExisting, setJoinExisting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState<Feedback>(null);

	const isLogin = mode === "login";

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);
		const name = String(formData.get("name") ?? "").trim();
		const email = String(formData.get("email") ?? "").trim();
		const password = String(formData.get("password") ?? "");
		const familyName = String(formData.get("familyName") ?? "").trim();
		const inviteCode = String(formData.get("inviteCode") ?? "").trim();

		if (!email || !password || (!isLogin && !name)) {
			setFeedback({
				kind: "error",
				message: "Completá todos los campos para continuar.",
			});
			return;
		}

		if (!isLogin && joinExisting && !inviteCode) {
			setFeedback({
				kind: "error",
				message: "Ingresá el código de invitación de tu familia.",
			});
			return;
		}

		setIsSubmitting(true);
		setFeedback(null);

		try {
			if (isLogin) {
				await onLogin(email, password);
			} else {
				await onRegister({
					name,
					email,
					password,
					...(joinExisting ? { inviteCode } : { familyName }),
				});
			}
			form.reset();
		} catch (error) {
			setFeedback({
				kind: "error",
				message:
					error instanceof Error
						? error.message
						: "No se pudo completar la operación.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className={styles.page}>
			<section className={styles.card} aria-labelledby='auth-title'>
				<div className={styles.brand}>
					<span className={styles.brandMark}>🏠</span>
					<div>
						<p className={styles.kicker}>OrgFamy</p>
						<h1 id='auth-title'>Acceso</h1>
					</div>
				</div>

				<p className={styles.subtitle}>
					Organizá la información familiar desde un solo lugar, con
					una entrada simple y clara.
				</p>

				<form className={styles.form} onSubmit={handleSubmit}>
					{!isLogin && (
						<div className={styles.field}>
							<label htmlFor='name'>Nombre de usuario</label>
							<input
								id='name'
								name='name'
								type='text'
								autoComplete='name'
							/>
						</div>
					)}

					<div className={styles.field}>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							name='email'
							type='email'
							autoComplete='email'
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor='password'>Contraseña</label>
						<input
							id='password'
							name='password'
							type='password'
							autoComplete={
								isLogin ? "current-password" : "new-password"
							}
						/>
					</div>

					{!isLogin && (
						<>
							<div className={styles.field}>
								<label htmlFor='joinExisting'>
									¿Ya hay una familia creada?
								</label>
								<select
									id='joinExisting'
									value={joinExisting ? "join" : "create"}
									onChange={(e) =>
										setJoinExisting(
											e.target.value === "join",
										)
									}
								>
									<option value='create'>
										No, quiero crear una nueva
									</option>
									<option value='join'>
										Sí, tengo un código de invitación
									</option>
								</select>
							</div>

							{joinExisting ? (
								<div className={styles.field}>
									<label htmlFor='inviteCode'>
										Código de invitación
									</label>
									<input
										id='inviteCode'
										name='inviteCode'
										type='text'
										maxLength={12}
										placeholder='Ej: K7M2QP4X'
										style={{ textTransform: "uppercase" }}
									/>
								</div>
							) : (
								<div className={styles.field}>
									<label htmlFor='familyName'>
										Nombre de la familia
									</label>
									<input
										id='familyName'
										name='familyName'
										type='text'
										maxLength={120}
										placeholder='Ej: Familia Pérez'
									/>
								</div>
							)}
						</>
					)}

					<button
						type='submit'
						className={styles.submitBtn}
						disabled={isSubmitting}
					>
						{isSubmitting
							? "Procesando..."
							: isLogin
								? "Entrar"
								: "Crear cuenta"}
					</button>
				</form>

				{feedback && (
					<p
						className={`${styles.feedback} ${feedback.kind === "success" ? styles.success : styles.error}`}
						role='status'
						aria-live='polite'
					>
						{feedback.message}
					</p>
				)}

				<p className={styles.footerText}>
					{isLogin ? "¿No tenés cuenta?" : "¿Ya tenés una cuenta?"}{" "}
					<button
						type='button'
						className={styles.linkButton}
						onClick={() => {
							setMode(isLogin ? "register" : "login");
							setFeedback(null);
						}}
					>
						{isLogin ? "Registrate" : "Iniciá sesión"}
					</button>
				</p>
			</section>
		</main>
	);
}
