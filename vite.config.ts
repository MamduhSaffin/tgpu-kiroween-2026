import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const revision = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.CF_PAGES_COMMIT_SHA

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'deployment-revision',
      transformIndexHtml() {
        if (!revision || !/^[a-f0-9]{40}$/.test(revision)) return []
        return [{ tag: 'meta', attrs: { name: 'deployment-revision', content: revision } }]
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
