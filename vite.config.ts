import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build-time "version" — there's no formal release process for this personal
// app, so the build date itself (YYYY.MM.DD) serves as a simple, always-
// increasing version string shown in the in-app "About" info.
function buildDateVersion(): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(buildDateVersion()),
  },
})
