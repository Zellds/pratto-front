import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { ApiError } from '@/api/client'
import { login } from './api'

type LoginFormProps = {
  onSuccess: (token: string) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => onSuccess(data.token),
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!username || !password) return
    mutation.mutate({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="login-username">{t('auth.username_label')}</label>
      <input
        id="login-username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="login-password">{t('auth.password_label')}</label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {mutation.isError && (
        <p role="alert">
          {mutation.error instanceof ApiError ? mutation.error.message : t('auth.generic_error')}
        </p>
      )}
      <Button type="submit" disabled={mutation.isPending}>
        {t('auth.login_submit')}
      </Button>
    </form>
  )
}
