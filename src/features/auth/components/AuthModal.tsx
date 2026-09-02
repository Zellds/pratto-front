import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/Modal'
import { useAuth } from '@/providers/AuthProvider'
import { useToast } from '@/providers/ToastProvider'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useTranslation()
  const { setToken } = useAuth()
  const { showToast } = useToast()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  function handleSuccess(token: string) {
    setToken(token)
    onClose()
    showToast(t('auth.login_success'))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabelledBy="auth-modal-title">
      <div>
        {mode === 'login' ? (
          <span id="auth-modal-title" aria-current="true">
            {t('auth.tab_login')}
          </span>
        ) : (
          <button onClick={() => setMode('login')}>{t('auth.tab_login')}</button>
        )}
        {mode === 'register' ? (
          <span id="auth-modal-title" aria-current="true">
            {t('auth.tab_register')}
          </span>
        ) : (
          <button onClick={() => setMode('register')}>{t('auth.tab_register')}</button>
        )}
      </div>
      {mode === 'login' ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSuccess={handleSuccess} />
      )}
    </Modal>
  )
}
