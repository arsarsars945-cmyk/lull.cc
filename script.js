const SUPABASE_URL = 'https://lkkwbfpvgvvoeicpsdnv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_HVW3bCU3aEKpf99IjNnU2g_FYxVFdZO';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
const modal = document.getElementById('modal');
const openButtons = document.querySelectorAll('[data-open-modal]');
const closeButton = document.querySelector('.modal-close');
const form = document.getElementById('demo-form');
const note = document.getElementById('demo-note');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
openButtons.forEach(button => {
  button.addEventListener('click', async event => {
    event.preventDefault();

    const { data: { session }, error } =
      await supabaseClient.auth.getSession();

    if (error) {
      note.textContent = 'Не удалось проверить авторизацию.';
      return;
    }

    if (session) {
      window.location.href = 'profile.html';
    } else {
      openModal();
    }
  });
});
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('show')));
let authMode = 'login';

const loginMode = document.getElementById('login-mode');
const signupMode = document.getElementById('signup-mode');
const authSubmit = document.getElementById('auth-submit');
const emailInput = document.getElementById('demo-email');
const passwordInput = document.getElementById('demo-password');

function setAuthMode(mode) {
  authMode = mode;
  const isLogin = mode === 'login';

  loginMode.classList.toggle('btn-primary', isLogin);
  loginMode.classList.toggle('btn-ghost', !isLogin);
  signupMode.classList.toggle('btn-primary', !isLogin);
  signupMode.classList.toggle('btn-ghost', isLogin);

  authSubmit.textContent = isLogin ? 'Войти ↗' : 'Создать аккаунт ↗';
  passwordInput.autocomplete = isLogin ? 'current-password' : 'new-password';
  note.textContent = isLogin
    ? 'Войди в свой аккаунт.'
    : 'После регистрации может потребоваться подтверждение email.';
}

loginMode.addEventListener('click', () => setAuthMode('login'));
signupMode.addEventListener('click', () => setAuthMode('signup'));

form.addEventListener('submit', async event => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  authSubmit.disabled = true;
  note.textContent = 'Подождите...';

  try {
    if (authMode === 'signup') {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
  emailRedirectTo: 'https://lullcc.vercel.app'
}
      });

      if (error) throw error;

      note.textContent = data.session
        ? 'Аккаунт создан! Вы вошли.'
        : 'Регистрация отправлена. Проверь почту и подтверди email.';
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      note.textContent = 'Вход выполнен успешно!';
passwordInput.value = '';
closeModal();

openButtons.forEach(button => {
  button.textContent = 'Аккаунт';
});
    }
  } catch (error) {
    note.textContent = error.message || 'Не удалось выполнить запрос.';
  } finally {
    authSubmit.disabled = false;
  }
});
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Аккаунт — lull.cc</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 20px;
      background: #08090c;
      color: #f5f5f7;
      font-family: Arial, sans-serif;
    }

    .profile {
      width: 100%;
      max-width: 440px;
      padding: 32px;
      border: 1px solid #292b33;
      border-radius: 18px;
      background: #111218;
    }

    .brand {
      margin-bottom: 28px;
      font-size: 25px;
      font-weight: 800;
    }

    .accent { color: #a78bfa; }

    h1 { margin-bottom: 8px; }

    .muted {
      color: #a1a1aa;
      overflow-wrap: anywhere;
    }

    .status {
      margin: 24px 0;
      padding: 13px;
      border-radius: 10px;
      background: #19291f;
      color: #86efac;
    }

    button {
      width: 100%;
      padding: 13px;
      border: 0;
      border-radius: 9px;
      background: #a78bfa;
      color: #111018;
      font-weight: 700;
      cursor: pointer;
    }

    a {
      display: block;
      margin-top: 18px;
      color: #c4b5fd;
      text-align: center;
    }

    #message {
      color: #fca5a5;
      overflow-wrap: anywhere;
    }
  </style>
</head>
<body>
  <main class="profile">
    <div class="brand">lull<span class="accent">.cc</span></div>

    <h1>Мой аккаунт</h1>
    <p class="muted">Email пользователя:</p>
    <p id="user-email">Проверяем авторизацию...</p>

    <div class="status" id="auth-status">
      Проверяем статус...
    </div>

    <button id="logout-button" type="button">
      Выйти из аккаунта
    </button>

    <p id="message" role="status" aria-live="polite"></p>
    <a href="index.html">Вернуться на главную</a>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    // Используй те же URL и Publishable key, что в script.js.
    const SUPABASE_URL = 'ВСТАВЬ_СВОЙ_PROJECT_URL';
    const SUPABASE_PUBLISHABLE_KEY = 'ВСТАВЬ_СВОЙ_PUBLISHABLE_KEY';

    const client = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    const emailElement = document.getElementById('user-email');
    const statusElement = document.getElementById('auth-status');
    const messageElement = document.getElementById('message');
    const logoutButton = document.getElementById('logout-button');

    async function checkSession() {
      const { data, error } = await client.auth.getSession();

      if (error) {
        statusElement.textContent = 'Не удалось проверить вход.';
        messageElement.textContent = error.message;
        return;
      }

      if (!data.session) {
        window.location.replace('index.html');
        return;
      }

      emailElement.textContent = data.session.user.email || 'Email не указан';
      statusElement.textContent = '● Авторизован';
    }

    logoutButton.addEventListener('click', async () => {
      logoutButton.disabled = true;
      messageElement.textContent = '';

      const { error } = await client.auth.signOut();

      if (error) {
        messageElement.textContent = error.message;
        logoutButton.disabled = false;
        return;
      }

      window.location.replace('index.html');
    });

    checkSession();
  </script>
</body>
</html>
