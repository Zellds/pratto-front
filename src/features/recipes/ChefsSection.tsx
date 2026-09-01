import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/Button'
import './ChefsSection.css'

const PLACEHOLDER_CHEF_NUMBERS = [1, 2, 3]

export function ChefsSection() {
  const { t } = useTranslation()

  return (
    <section>
      <h2>{t('recipes.chefs_title')}</h2>
      {/*
        Não existe endpoint de listagem/ranking de usuários no backend
        (confirmado em docs/follow.md — "sem endpoint de listar
        seguidores/seguidos"). Cards de exemplo claramente fictícios,
        botão "Seguir" desabilitado, até essa feature existir de verdade.
      */}
      <div className="chefs-grid">
        {PLACEHOLDER_CHEF_NUMBERS.map((n) => (
          <div className="chef-card" key={n}>
            <p>{t('recipes.chef_placeholder_name', { n })}</p>
            <Button variant="secondary" disabled title={t('recipes.follow_disabled_hint')}>
              {t('recipes.follow_button')}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
