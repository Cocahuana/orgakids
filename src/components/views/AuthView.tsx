import { useState, type FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getAuthInstance, getDbInstance } from '../../lib/firebase';
import styles from './AuthView.module.css';

type Mode = 'login' | 'register';
type Feedback = {
  kind: 'success' | 'error';
  message: string;
} | null;

// Firestore writes are handled directly; debug helpers removed.

export function AuthView() {
  const [mode, setMode] = useState<Mode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const isLogin = mode === 'login';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password || (!isLogin && !name)) {
      setFeedback({
        kind: 'error',
        message: 'Completá todos los campos para continuar.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const auth = getAuthInstance();
      const db = getDbInstance();

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setFeedback({
          kind: 'success',
          message: 'Sesión iniciada correctamente.',
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, {
          displayName: name,
        });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name,
          email,
          createdAt: serverTimestamp(),
        });

        setFeedback({
          kind: 'success',
          message: 'Usuario registrado y guardado en Firestore.',
        });
      }

      event.currentTarget.reset();
      if (!isLogin) {
        setMode('login');
      }
    } catch (error) {
      console.error('Auth/register error:', error);
      // Try to extract Firebase error code if available
      // @ts-ignore
      const code = error?.code ?? null;
      const message = error instanceof Error ? error.message : 'No se pudo completar la operación.';
      setFeedback({
        kind: 'error',
        message: code ? `${message} (code: ${code})` : message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-title">
        <div className={styles.brand}>
          <span className={styles.brandMark}>📚</span>
          <div>
            <p className={styles.kicker}>OrgaKids</p>
            <h1 id="auth-title">Acceso</h1>
          </div>
        </div>

        <p className={styles.subtitle}>
          Organizá la información familiar desde un solo lugar, con una entrada
          simple y clara.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.field}>
              <label htmlFor="name">Nombre de usuario</label>
              <input id="name" name="name" type="text" autoComplete="name" />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : isLogin ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        {/* debug/test UI removed */}

        {feedback && (
          <p
            className={`${styles.feedback} ${feedback.kind === 'success' ? styles.success : styles.error}`}
            role="status"
            aria-live="polite"
          >
            {feedback.message}
          </p>
        )}

        <p className={styles.footerText}>
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés una cuenta?'}{' '}
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setMode(isLogin ? 'register' : 'login')}
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </section>
    </main>
  );
}