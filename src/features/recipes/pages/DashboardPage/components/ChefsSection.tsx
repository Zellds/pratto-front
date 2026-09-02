import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button'
import './ChefsSection.css'

const PLACEHOLDER_CHEFS = [
  { n: 1, initials: 'C1' },
  { n: 2, initials: 'C2' },
  { n: 3, initials: 'C3' },
]

export function ChefsSection() {
  const { t } = useTranslation()

  return (
    <section className="sec">
      <h2>{t('recipes.chefs_title')}</h2>
      {/*
        Não existe endpoint de listagem/ranking de usuários no backend
        (confirmado em docs/follow.md — "sem endpoint de listar
        seguidores/seguidos"). Cards de exemplo claramente fictícios,
        botão "Seguir" desabilitado, até essa feature existir de verdade.
      */}
      <div className="chefs-grid">
        {PLACEHOLDER_CHEFS.map(({ n, initials }) => (
          <div className="chef-card" key={n}>
            <div className="chef-avatar" aria-hidden="true">
              {initials}
            </div>
            <p className="chef-name">{t('recipes.chef_placeholder_name', { n })}</p>
            <Button
              variant="secondary"
              disabled
              title={t('recipes.follow_disabled_hint')}
              className="chef-follow"
            >
              {t('recipes.follow_button')}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
