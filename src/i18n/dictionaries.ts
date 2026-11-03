import type { Locale } from './config'

// Interface strings that are not content. Everything editable lives in the CMS.

const pt = {
  // Page titles used when the SEO tab is empty
  pages: {
    about: 'Sobre',
    projects: 'Projetos',
    uses: 'Vida',
  },
  nav: {
    home: 'Página inicial',
    press: 'Press',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    switchLanguage: 'Ver em inglês',
    search: 'Abrir busca',
  },
  soon: 'SOON',
  projects: {
    filter: 'Filtro:',
    empty: 'Nenhum projeto nessa categoria ainda.',
    case: 'CASE',
    live: 'Projeto no ar',
    visit: 'Acessar',
    viewAll: 'Ver todos',
    more: ['Explore', 'mais projetos'],
    specs: 'Especificações',
    service: 'Serviço',
    solution: 'Solução',
    industry: 'Indústria',
    year: 'Ano',
    technology: 'Tecnologia',
  },
  career: {
    work: 'Trabalho',
    education: 'Formação',
  },
  uses: {
    collapse: 'Recolher',
    expand: 'Expandir',
    collapseAll: 'Recolher todos',
    expandAll: 'Expandir todos',
  },
  legal: {
    updated: 'Atualizado em',
  },
  footer: {
    backToTop: 'Voltar ao topo',
    and: ' e ',
    cookies: 'Preferências de cookies',
  },
  consent: {
    label: 'Aviso de cookies',
    text: 'Uso cookies do Google Analytics para entender como o site é usado. Eles só são ativados se você aceitar, e você pode mudar de ideia quando quiser.',
    policy: 'Política de Privacidade',
    accept: 'Aceitar',
    reject: 'Recusar',
  },
  error: {
    title: 'Algo deu errado',
    text: 'Não foi possível carregar esta página agora. Tente de novo em instantes.',
    retry: 'Tentar de novo',
    home: 'Voltar para a home',
  },
  notFound: {
    title: 'Parece que você se perdeu',
    text: 'Sem problemas. Te ajudo a voltar para o caminho certo.',
    button: 'Voltar para a home',
  },
  search: {
    label: 'Buscar no site',
    placeholder: 'Buscar páginas, projetos…',
    empty: 'Nenhum resultado para',
    groups: {
      pages: 'Páginas',
      projects: 'Projetos',
      uses: 'Vida',
      socials: 'Redes',
      actions: 'Ações',
    },
    actions: {
      hire: 'Quero contratar pelo WhatsApp',
      copyEmail: 'Copiar e-mail',
      copied: 'E-mail copiado!',
      language: 'Ver o site em inglês',
    },
    hints: {
      navigate: 'navegar',
      open: 'abrir',
      close: 'fechar',
    },
  },
}

export type Dictionary = typeof pt

const en: Dictionary = {
  pages: {
    about: 'About',
    projects: 'Projects',
    uses: 'Uses',
  },
  nav: {
    home: 'Home',
    press: 'Press',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguage: 'Ver em português',
    search: 'Open search',
  },
  soon: 'SOON',
  projects: {
    filter: 'Filter:',
    empty: 'No projects in this category yet.',
    case: 'CASE',
    live: 'Live project',
    visit: 'Visit',
    viewAll: 'View all',
    more: ['Explore', 'more projects'],
    specs: 'Specifications',
    service: 'Service',
    solution: 'Solution',
    industry: 'Industry',
    year: 'Year',
    technology: 'Technology',
  },
  career: {
    work: 'Work',
    education: 'Education',
  },
  uses: {
    collapse: 'Collapse',
    expand: 'Expand',
    collapseAll: 'Collapse all',
    expandAll: 'Expand all',
  },
  legal: {
    updated: 'Last updated on',
  },
  footer: {
    backToTop: 'Back to top',
    and: ' and ',
    cookies: 'Cookie preferences',
  },
  consent: {
    label: 'Cookie notice',
    text: 'I use Google Analytics cookies to understand how the site is used. They are only turned on if you accept, and you can change your mind at any time.',
    policy: 'Privacy Policy',
    accept: 'Accept',
    reject: 'Decline',
  },
  error: {
    title: 'Something went wrong',
    text: 'This page could not be loaded right now. Please try again in a moment.',
    retry: 'Try again',
    home: 'Back to home',
  },
  notFound: {
    title: 'Looks like you got lost',
    text: 'No worries. Let me help you get back on track.',
    button: 'Back to home',
  },
  search: {
    label: 'Search the site',
    placeholder: 'Search pages, projects…',
    empty: 'No results for',
    groups: {
      pages: 'Pages',
      projects: 'Projects',
      uses: 'Uses',
      socials: 'Socials',
      actions: 'Actions',
    },
    actions: {
      hire: 'Hire me on WhatsApp',
      copyEmail: 'Copy e-mail',
      copied: 'E-mail copied!',
      language: 'Ver o site em português',
    },
    hints: {
      navigate: 'navigate',
      open: 'open',
      close: 'close',
    },
  },
}

const dictionaries: Record<Locale, Dictionary> = { pt, en }

export const getDictionary = (locale: Locale) => dictionaries[locale]
