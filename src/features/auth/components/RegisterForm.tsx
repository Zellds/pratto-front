import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import { ApiError } from '@/api/client'
import { register } from '../api'

type RegisterFormProps = {
  onSuccess: (token: string) => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => onSuccess(data.token),
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!username || !displayName || !password) return
    mutation.mutate({ username, display_name: displayName, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="register-username">{t('auth.username_label')}</label>
      <input
        id="register-username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="register-display-name">{t('auth.display_name_label')}</label>
      <input
        id="register-display-name"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />
      <label htmlFor="register-password">{t('auth.password_label')}</label>
      <input
        id="register-password"
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
        {t('auth.register_submit')}
      </Button>
    </form>
  )
}
