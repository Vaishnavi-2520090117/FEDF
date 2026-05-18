const ADMIN = { username: 'admin', password: 'Admin@123' };

function openModal(type) {
  document.getElementById(type + 'Modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(type) {
  document.getElementById(type + 'Modal').classList.remove('active');
  document.body.style.overflow = '';
}
function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 120);
}

// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(o =>
  o.addEventListener('click', e => {
    if (e.target === o) { o.classList.remove('active'); document.body.style.overflow = ''; }
  })
);

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-overlay.active').forEach(o => { o.classList.remove('active'); document.body.style.overflow = ''; });
});

function showToast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color || '#3a7d44';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

function g(id) { return document.getElementById(id).value.trim(); }

function handleLogin() {
  const user = g('loginUser'), pass = g('loginPass');
  if (!user || !pass) return showToast('⚠️ Please fill in all fields', '#e67e22');
  if (user === ADMIN.username && pass === ADMIN.password) {
    closeModal('login');
    setTimeout(() => { openModal('admin'); showToast('✅ Welcome, Administrator!'); }, 200);
    return;
  }
  const users = JSON.parse(localStorage.getItem('pharma_users') || '[]');
  const found = users.find(u => (u.username === user || u.email === user) && u.password === pass);
  found ? (closeModal('login'), showToast(`✅ Welcome back, ${found.firstName}!`))
        : showToast('❌ Invalid username or password', '#c0392b');
}

function handleSignup() {
  const first = g('suFirst'), last = g('suLast'), username = g('suUsername'),
        email = g('suEmail'), phone = g('suPhone'), role = g('suRole'),
        pass = g('suPass'), confirm = g('suConfirm');
  if (![first,last,username,email,phone,role,pass,confirm].every(Boolean))
    return showToast('⚠️ Please fill in all fields', '#e67e22');
  if (pass !== confirm) return showToast('❌ Passwords do not match', '#c0392b');
  if (pass.length < 8) return showToast('❌ Password must be at least 8 characters', '#c0392b');
  if (!/\S+@\S+\.\S+/.test(email)) return showToast('❌ Invalid email address', '#c0392b');
  const users = JSON.parse(localStorage.getItem('pharma_users') || '[]');
  if (users.find(u => u.username === username)) return showToast('❌ Username already exists', '#c0392b');
  users.push({ firstName: first, lastName: last, username, email, phone, role, password: pass });
  localStorage.setItem('pharma_users', JSON.stringify(users));
  closeModal('signup');
  if (role === 'Admin') {
    setTimeout(() => { openModal('admin'); showToast(`✅ Welcome, Admin ${first}!`); }, 200);
  } else {
    showToast(`✅ Account created! Welcome, ${first}!`);
  }
}

function handleForgot() {
  const email = g('forgotEmail');
  if (!/\S+@\S+\.\S+/.test(email)) return showToast('⚠️ Enter a valid email', '#e67e22');
  closeModal('forgot');
  showToast('📧 Password reset link sent to ' + email);
}
