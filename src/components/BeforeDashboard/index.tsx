import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Bem-vindo ao painel do site!</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' com o conteúdo do layout e depois '}
          <a href="/" target="_blank">
            veja o site
          </a>
          . Isso apaga as páginas, projetos e mídias atuais.
        </li>
        <li>
          O conteúdo de cada página fica em <strong>Páginas</strong>, conforme o template escolhido. Contato,
          redes sociais, números e stack ficam em <strong>Configurações</strong>.
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
