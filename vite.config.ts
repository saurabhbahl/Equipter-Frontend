
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
})

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       react: require.resolve('react'),
//       'react-dom': require.resolve('react-dom')
//     }
//   },
//   server: {
//     host: true,
//   },
// })
