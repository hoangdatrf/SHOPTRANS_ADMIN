<template>
  <main class="admin-login">
    <section class="login-card">
      <div class="brand">
        <div class="brand-mark">ST</div>
        <div>
          <strong>Shoptrans</strong>
          <span>Admin Console</span>
        </div>
      </div>

      <div class="copy">
        <p>SECURE ADMIN ACCESS</p>
        <h1>Sign in</h1>
      </div>

      <form @submit.prevent="submit">
        <label>
          <span>Admin username</span>
          <input v-model.trim="form.username" name="username" autocomplete="username" placeholder="Enter Username" />
        </label>
        <label>
          <span>Password</span>
          <input v-model="form.password" name="password" autocomplete="current-password" type="password" placeholder="Enter Password" />
        </label>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAdminConsoleStore } from '~/store/adminConsole'

definePageMeta({ layout: false })

const router = useRouter()
const adminStore = useAdminConsoleStore()
const loading = ref(false)
const error = ref('')
const form = reactive({
  username: '',
  password: '',
})

// Compile/download the large console route while the user is entering credentials,
// so clicking Sign in does not have to wait for the route bundle from scratch.
onMounted(() => {
  void preloadRouteComponents('/admin')
})

const submit = async () => {
  error.value = ''
  if (!form.username || !form.password) {
    error.value = 'Username and password are required.'
    return
  }

  loading.value = true
  try {
    await adminStore.login(form.username, form.password)
    await router.replace('/admin')
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Invalid admin credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  --green: #16A34A;
  --green-d: #0f7a37;
  --green-l: #e7f9ef;
  --g50: #f7f8f7;
  --g100: #e4e8e4;
  --g300: #9aa69c;
  --g500: #4a564d;
  --g700: #1c2420;
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  width: 100vw;
  min-height: 100vh;
  overflow: auto;
  display: grid;
  place-items: center;
  padding: 24px;
  color: var(--g700);
  background: var(--g50);
  background-image: radial-gradient(#d6dcd6 1px, transparent 1px);
  background-size: 22px 22px;
  font-family: Geist, system-ui, sans-serif;
}
:global(body:has(.admin-login)) {
  overflow: hidden;
}
.login-card {
  width: min(460px, 100%);
  border: 1px solid var(--g100);
  border-radius: 18px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 20px 40px -12px rgba(28,36,32,.22);
  padding: 28px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 34px;
}
.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #00C566, var(--green));
  font-weight: 800;
}
.brand strong { display: block; font-size: 17px; }
.brand span { display: block; font-size: 11px; color: var(--g300); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.copy { margin-bottom: 22px; }
.copy p { color: var(--green-d); font-size: 11px; font-weight: 800; letter-spacing: .08em; margin: 0 0 8px; }
.copy h1 { margin: 0; font-size: 30px; letter-spacing: -.04em; line-height: 1.08; }
.copy span { display: block; color: var(--g500); margin-top: 10px; font-size: 14px; }
form { display: grid; gap: 14px; }
label { display: grid; gap: 6px; font-size: 12px; font-weight: 700; color: var(--g500); }
input {
  width: 100%;
  border: 1px solid #c3ccc4;
  border-radius: 11px;
  padding: 12px 14px;
  outline: none;
  font-size: 14px;
}
input:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--green-l); }
button {
  margin-top: 4px;
  border: 0;
  border-radius: 11px;
  padding: 12px 15px;
  background: var(--green);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}
button:disabled { opacity: .6; cursor: wait; }
.error {
  margin: 0;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fff1f2;
  color: #b91c1c;
  padding: 9px 11px;
  font-size: 13px;
  font-weight: 600;
}
</style>
