import { FormEvent, useEffect, useRef, useState } from 'react';

interface FormState {
  username: string;
  password: string;
  rememberMe: boolean;
}

const initialState: FormState = {
  username: '',
  password: '',
  rememberMe: false,
};

interface Session {
  username: string;
  points: number;
}

const SESSION_STORAGE_KEY = 'sw-login:session';

const ACCOUNT_URL = 'https://www.southwest.com/account/myaccount.html';
const ENROLL_URL = 'https://www.southwest.com/rapidrewards/enroll';
const FIRST_TIME_URL = 'https://www.southwest.com/rapidrewards/first-time-login';
const FORGOT_LOGIN_URL = 'https://www.southwest.com/rapidrewards/forgot-login';
const FORGOT_PASSWORD_URL = 'https://www.southwest.com/rapidrewards/forgot-password';

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage unavailable (e.g. disabled) — session just won't persist.
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5Z"
      />
    </svg>
  );
}

export interface LoginProps {
  /** Called in addition to the built-in mock session when the form is submitted. */
  onLogin?: (session: Session) => void;
  /** Called in addition to clearing the built-in mock session when "Log out" is clicked. */
  onLogout?: () => void;
}

export default function Login({ onLogin, onLogout }: LoginProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      // Inside the shadow root, event.target gets retargeted to the
      // <sw-login> host once the event crosses the shadow boundary, so
      // containerRef.contains(event.target) is always false for clicks
      // inside our own form. composedPath() preserves the real path.
      const path = event.composedPath();
      if (containerRef.current && !path.includes(containerRef.current)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Mock login: there's no real Southwest auth API, so any non-empty
    // account number/username + password is accepted as-is.
    const newSession: Session = {
      username: form.username.trim(),
      points: Math.floor(Math.random() * 9000) + 500,
    };
    saveSession(newSession);
    setSession(newSession);
    setOpen(false);
    setForm(initialState);
    onLogin?.(newSession);
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    onLogout?.();
  }

  if (session) {
    return (
      <div className="sw-login sw-login--bar">
        <span className="sw-login__greeting">Hi, {session.username}</span>
        <span className="sw-login__points">{session.points.toLocaleString()} points</span>
        <a className="sw-login__link" href={ACCOUNT_URL} target="_blank" rel="noopener noreferrer">
          My Account
        </a>
        <span className="sw-login__sep">|</span>
        <button type="button" className="sw-login__link sw-login__link--button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="sw-login">
      <span className="sw-login__prompt">Log in to view points balance</span>

      <div className="sw-login__trigger-wrap" ref={containerRef}>
        <button
          type="button"
          className="sw-login__trigger"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((prev) => !prev)}
        >
          <PersonIcon />
          Log in
        </button>

        {open && (
          <div className="sw-login__panel" role="dialog" aria-label="Log in">
            <div className="sw-login__arrow" />

            <div className="sw-login__header">
              <h2>Log in</h2>
              <a href={FIRST_TIME_URL} target="_blank" rel="noopener noreferrer">
                First time logging in?
              </a>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="sw-login__field-row">
                <label htmlFor="sw-login-username">Account number or username</label>
                <a href={FORGOT_LOGIN_URL} target="_blank" rel="noopener noreferrer">
                  Forgot login?
                </a>
              </div>
              <input
                id="sw-login-username"
                required
                value={form.username}
                onChange={(e) => update('username', e.target.value)}
              />

              <div className="sw-login__field-row">
                <label htmlFor="sw-login-password">Password</label>
                <a href={FORGOT_PASSWORD_URL} target="_blank" rel="noopener noreferrer">
                  Forgot password?
                </a>
              </div>
              <input
                id="sw-login-password"
                type="password"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />

              <label className="sw-login__checkbox">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => update('rememberMe', e.target.checked)}
                />
                Remember me
              </label>

              <div className="sw-login__footer">
                <p className="sw-login__enroll">
                  Not a member?
                  <br />
                  <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer">
                    Enroll Now
                  </a>
                </p>
                <button type="submit" className="sw-login__submit">
                  Log in
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <a className="sw-login__create" href={ENROLL_URL} target="_blank" rel="noopener noreferrer">
        Create account
      </a>
    </div>
  );
}
