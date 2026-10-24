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
openButtons.forEach(button => button.addEventListener('click', openModal));
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
async function updateAuthUI() {
  const { data: { session }, error } =
    await supabaseClient.auth.getSession();

  if (error) {
    console.error('Ошибка проверки сессии:', error);
    return;
  }

  openButtons.forEach(button => {
    button.textContent = session ? 'Аккаунт' : 'Войти';
  });
}

updateAuthUI();

supabaseClient.auth.onAuthStateChange((_event, session) => {
  openButtons.forEach(button => {
    button.textContent = session ? 'Аккаунт' : 'Войти';
  });
});
