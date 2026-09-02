import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import './styles/tokens.css'
import './app/i18n'
import { router } from './app/routes.tsx'
import { ThemeProvider } from './app/ThemeProvider.tsx'
import { AuthProvider } from './app/AuthProvider.tsx'
import { ToastProvider } from './shared/ui/ToastProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
