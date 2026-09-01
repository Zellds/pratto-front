import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../../shared/ui/Modal'
import { useAuth } from '../../app/AuthProvider'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useTranslation()
  const { setToken } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  function handleSuccess(token: string) {
    setToken(token)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <button
          onClick={() => setMode('login')}
          disabled={mode === 'login'}
          aria-hidden={mode === 'login'}
        >
          {t('auth.tab_login')}
        </button>
        <button
          onClick={() => setMode('register')}
          disabled={mode === 'register'}
          aria-hidden={mode === 'register'}
        >
          {t('auth.tab_register')}
        </button>
      </div>
      {mode === 'login' ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSuccess={handleSuccess} />
      )}
    </Modal>
  )
}
