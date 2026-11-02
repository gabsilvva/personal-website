import type { CollectionSlug, Payload, PayloadRequest } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { translateToEnglish } from './english'
import { doc, h2, p, ul } from './lexical'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const asset = (file: string) => path.resolve(dirname, 'assets', file)

// The page globals are simply overwritten below
const collections: CollectionSlug[] = ['pages', 'projects', 'media']

// Skips the Next.js revalidation hooks while seeding
const context = { disableRevalidate: true }

/**
 * Fills the CMS with the content of the Figma design. Clears pages, projects and media first.
 */
export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }) => {
  payload.logger.info('Seeding database...')

  payload.logger.info('— Clearing pages, projects and media...')
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info('— Uploading media...')
  const files: Array<[file: string, alt: string]> = [
    ['portrait.png', 'Retrato de Gabriel da Silva'],
    ['cat.png', 'Meu gato'],
    ['memoji.png', 'Memoji fazendo joinha'],
    ['logo-l0gik.svg', 'Logo da L0gik'],
    ['logo-fullcycle.png', 'Logo da Full Cycle'],
    ['logo-brinov.svg', 'Logo da Brinov'],
    ['opengraph.jpg', 'GAB.S — Gabriel da Silva'],
    ['project-kritica.png', 'Plataforma Kritica'],
    ['project-brinov.png', 'Site da Brinov'],
    ['project-broot.png', 'Broot'],
    ['project-issue-helper.png', 'Issue Helper'],
    ['project-logicos.png', 'Site da Lógicos'],
    ['project-cms.png', 'Painel de gestão de conteúdo'],
  ]

  // Sequential: every write shares the request's transaction
  const media = []
  for (const [file, alt] of files) {
    media.push(
      await payload.create({
        collection: 'media',
        data: { alt },
        filePath: asset(file),
        req,
        context,
      }),
    )
  }

  const [portrait, cat, memoji, logoL0gik, logoFullCycle, logoBrinov, ogDefault, ...thumbnails] =
    media

  payload.logger.info('— Creating projects...')
  const projectsData = [
    {
      slug: 'kritica',
      title: 'Feedback Platform',
      client: 'Kritica',
      year: '2026',
      soon: true,
      categories: ['code', 'design'] as ('code' | 'design')[],
      technologies: ['Next.js', 'PostgreSQL', 'Nest.js', 'Layout', 'Figma'],
    },
    {
      slug: 'brinov',
      title: 'Full Website',
      client: 'Brinov',
      year: '2026',
      categories: ['code', 'design'] as ('code' | 'design')[],
      technologies: ['Next.js', 'Wordpress', 'Headless CMS', 'Layout', 'Figma'],
      logo: logoBrinov.id,
      summary:
        'O site foi construído em Next.js com WordPress headless, unindo a velocidade de uma aplicação moderna à autonomia de um CMS que o time já conhece.',
      intro:
        'Um {novo site} para uma consultoria que leva tecnologia, economia e praticidade a empresas de {todo o Brasil. Design sob medida}, performance de ponta e {conteúdo pensado para ser encontrado no Google e nas IAs}.',
      description: doc(
        p(
          'A Brinov é uma consultoria de TI de Curitiba que, desde 2012, ajuda empresas a contratar e gerenciar softwares como Microsoft 365, Google Workspace e soluções de segurança. Fui responsável pelo projeto de ponta a ponta: layout, design de interface e desenvolvimento.',
        ),
        p(
          'A estrutura foi otimizada para SEO e GEO, garantindo visibilidade tanto nos buscadores quanto em respostas de inteligência artificial.',
        ),
      ),
      specs: {
        service: 'Layout, Site, CMS',
        solution: 'Site',
        industry: 'Tecnologia',
        technology: 'Next.js, Wordpress',
      },
    },
    {
      slug: 'broot',
      title: 'GYM SaaS',
      client: 'Broot',
      year: '2027',
      soon: true,
      categories: ['code', 'design'] as ('code' | 'design')[],
      technologies: ['Next.js', 'Firebase', 'Node.js', 'Layout', 'Figma'],
    },
    {
      slug: 'issue-helper',
      title: 'HelpDesk Platform',
      client: 'Issue Helper',
      year: '2026',
      categories: ['code'] as ('code' | 'design')[],
      technologies: ['Next.js', 'Express', 'Node.js'],
    },
    {
      slug: 'logicos',
      title: 'Full Website',
      client: 'Lógicos',
      year: '2026',
      categories: ['code', 'design'] as ('code' | 'design')[],
      technologies: ['Nuxt.js', 'Strapi', 'Figma'],
    },
    {
      slug: 'modern-cms',
      title: 'Modern Content Management',
      client: 'CMS',
      year: '2027',
      soon: true,
      categories: ['code', 'design'] as ('code' | 'design')[],
      technologies: ['Next.js', 'PostgreSQL', 'Node.js', 'Layout', 'Figma'],
    },
  ]

  // Created one by one so the admin order matches the design
  const projects = []
  for (const [index, project] of projectsData.entries()) {
    projects.push(
      await payload.create({
        collection: 'projects',
        data: {
          ...project,
          thumbnail: thumbnails[index].id,
          cover: project.slug === 'brinov' ? thumbnails[index].id : undefined,
          meta: {
            title: `${project.title} — ${project.client} — Gabriel da Silva`,
            description:
              project.summary ??
              `${project.title} para a ${project.client}, desenvolvido com ${project.technologies.join(', ')}.`,
            image: thumbnails[index].id,
          },
          _status: 'published',
        },
        req,
        context,
      }),
    )
  }
  const [kritica, brinov, broot] = projects

  payload.logger.info('— Creating text pages...')
  const createPage = (data: Record<string, unknown>) =>
    payload.create({
      collection: 'pages',
      data: { ...data, _status: 'published' } as never,
      req,
      context,
    })

  const privacy = await createPage({
    title: 'Política de Privacidade',
    slug: 'politica-de-privacidade',
    meta: {
      title: 'Política de Privacidade — Gabriel da Silva',
      description:
        'Como os dados de quem visita o site de Gabriel da Silva são tratados, em conformidade com a LGPD.',
    },
    content: doc(
      p(
        'Esta Política de Privacidade explica como João Gabriel da Silva ("eu") trata as informações de quem visita este site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).',
      ),
      h2('1. Dados coletados'),
      p('Este site não possui formulários nem área de cadastro. Os únicos dados tratados são:'),
      ul(
        [
          'Dados de navegação: informações anônimas como páginas visitadas, tempo de permanência, tipo de dispositivo, navegador e localização aproximada, coletadas por ferramentas de análise.',
        ],
        [
          'Dados de contato: quando você clica no botão do WhatsApp, a conversa acontece fora deste site. Nome, número e mensagens que você enviar são usados apenas para responder ao seu contato e conduzir uma possível proposta.',
        ],
      ),
      h2('2. Finalidade'),
      p('Os dados são usados para:'),
      ul(
        ['Entender como o site é utilizado e melhorar sua experiência;'],
        ['Responder contatos e enviar propostas comerciais;'],
        ['Cumprir obrigações legais, quando necessário.'],
      ),
      p('Não vendo, alugo ou compartilho seus dados com terceiros para fins de marketing.'),
      h2('3. Cookies'),
      p(
        'Este site pode utilizar cookies para fins de análise de tráfego e desempenho. Você pode desativá-los a qualquer momento nas configurações do seu navegador, sem prejuízo ao acesso ao conteúdo.',
      ),
      h2('4. Serviços de terceiros'),
      p('Alguns serviços externos podem tratar dados conforme suas próprias políticas:'),
      ul(
        ['WhatsApp (Meta): canal de contato;'],
        ['[Ferramenta de análise, ex.: Google Analytics ou Vercel Analytics]: métricas de acesso;'],
        ['[Provedor de hospedagem, ex.: Vercel]: hospedagem do site;'],
        [
          'Redes sociais: os links para Dribbble, GitHub, LinkedIn e Instagram direcionam para plataformas externas.',
        ],
      ),
      h2('5. Pagamentos em criptomoedas'),
      p(
        'Pagamentos em criptomoedas são combinados diretamente comigo, fora do site. Transações em blockchain são públicas e irreversíveis por natureza. Endereços de carteira são usados apenas para confirmar o recebimento.',
      ),
      h2('6. Armazenamento e segurança'),
      p(
        'Os dados são mantidos apenas pelo tempo necessário para cumprir as finalidades descritas. Adoto medidas técnicas razoáveis para proteger as informações contra acesso não autorizado.',
      ),
      h2('7. Seus direitos'),
      p(
        'Conforme a LGPD, você pode, a qualquer momento, solicitar acesso, correção, anonimização ou exclusão dos seus dados, além de revogar seu consentimento. Basta entrar em contato pelo e-mail abaixo.',
      ),
      h2('8. Contato'),
      p('Dúvidas sobre esta política: ', {
        link: 'hi@gabsilva.dev',
        url: 'mailto:hi@gabsilva.dev',
      }),
    ),
  })

  const terms = await createPage({
    title: 'Termos de Uso',
    slug: 'termos-de-uso',
    meta: {
      title: 'Termos de Uso — Gabriel da Silva',
      description:
        'Condições de uso do site e portfólio de Gabriel da Silva: propriedade intelectual, contratação e pagamentos.',
    },
    content: doc(
      p(
        'Ao acessar este site, você concorda com os termos abaixo. Se não concordar, recomendo não utilizá-lo.',
      ),
      h2('1. Sobre o site'),
      p(
        'Este é o site pessoal e portfólio de João Gabriel da Silva, com o objetivo de apresentar serviços, projetos e formas de contato. O conteúdo tem caráter informativo e não constitui uma proposta comercial.',
      ),
      h2('2. Propriedade intelectual'),
      p(
        'Textos, layout, imagens, código e identidade visual deste site são de minha autoria, salvo indicação contrária, e não podem ser copiados ou reproduzidos sem autorização. Marcas, logotipos e projetos de clientes exibidos no portfólio pertencem aos seus respectivos donos e são apresentados apenas para fins de demonstração de trabalho.',
      ),
      h2('3. Contratação de serviços'),
      p(
        'Valores, prazos, escopo e formas de pagamento são definidos em proposta ou contrato específico para cada projeto. As informações exibidas no site não substituem esse acordo.',
      ),
      h2('4. Pagamentos em criptomoedas'),
      p(
        'Quando aceito, o pagamento em criptomoedas tem o valor fechado em real ou dólar e convertido pela cotação no momento do pagamento. O cliente é responsável por enviar o valor correto para o endereço e a rede informados. Transações em blockchain são irreversíveis, e envios para endereço ou rede errados não podem ser recuperados.',
      ),
      h2('5. Links externos'),
      p(
        'O site contém links para serviços de terceiros, como WhatsApp e redes sociais. Não me responsabilizo pelo conteúdo ou pelas práticas de privacidade dessas plataformas.',
      ),
      h2('6. Limitação de responsabilidade'),
      p(
        'Busco manter as informações do site corretas e atualizadas, mas não garanto que estejam livres de erros ou disponíveis o tempo todo. Não me responsabilizo por danos decorrentes do uso das informações aqui publicadas.',
      ),
      h2('7. Alterações'),
      p(
        'Estes termos podem ser atualizados a qualquer momento. A data da última atualização fica sempre indicada no topo desta página.',
      ),
      h2('8. Legislação e foro'),
      p(
        'Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca do Rio de Janeiro/RJ para resolver eventuais questões.',
      ),
      h2('9. Contato'),
      p('Dúvidas sobre estes termos: ', { link: 'hi@gabsilva.dev', url: 'mailto:hi@gabsilva.dev' }),
    ),
  })

  payload.logger.info('— Filling the pages...')
  const updatePage = (
    slug: 'home-page' | 'about-page' | 'projects-page' | 'uses-page',
    data: Record<string, unknown>,
  ) =>
    payload.updateGlobal({
      slug,
      data: { ...data, _status: 'published' } as never,
      req,
      context,
    })

  await updatePage('projects-page', {
    meta: {
      title: 'Projetos — Gabriel da Silva',
      description:
        'Sites, plataformas e produtos digitais que desenvolvi para empresas de diferentes setores, do design ao código.',
    },
    banner: {
      subtitle: 'Projetos',
      title: 'Trabalhos\nque falam por mim',
      text: 'Ajudo empresas de diferentes setores a saírem do papel e crescerem no digital. Aqui estão alguns dos meus projetos mais recentes.',
    },
  })

  await updatePage('about-page', {
    meta: {
      title: 'Sobre — Gabriel da Silva',
      description:
        'Mais de 6 anos construindo produtos digitais de ponta a ponta. Conheça minha história, carreira e a stack que uso.',
    },
    hero: {
      title: 'Mais de 6 anos\n{construindo produtos}\n{digitais de} // ponta a ponta.',
      subtitle: 'Prazer, João Gabriel',
      image: portrait.id,
      text: 'Hoje sou Engenheiro de Software Pleno na L0gik, onde desenvolvo soluções que já alcançaram cerca de 12 milhões de usuários. Em paralelo, atendo projetos freelance e estudo arquitetura de aplicações de grande porte.',
    },
    story: {
      subtitle: 'História',
      text: doc(
        p(
          'Estou no digital desde 2019. São mais de ',
          { bold: '6 anos entre design e código' },
          ', construindo ',
          { bold: 'sites, plataformas e produtos para empresas de todos os tamanhos' },
          '.',
        ),
        p(
          'Minha jornada começou no design gráfico, criando peças e identidades visuais. Em poucos meses descobri a programação, entrei como estagiário de front-end e ',
          { bold: 'fui promovido em apenas 6 meses' },
          '. Desde então, nunca mais separei as duas coisas: ',
          { bold: 'desenho pensando no código e programo pensando em quem vai usar' },
          '.',
        ),
        p(
          'Nos últimos anos, ',
          { bold: 'meus projetos chegaram a impactar cerca de 12 milhões de pessoas' },
          ', em produtos para agências, startups e grandes marcas. Hoje, ',
          {
            bold: 'meu foco é ajudar empresas a crescerem no digital com soluções rápidas, bonitas e feitas para durar',
          },
          '.',
        ),
      ),
      favorites: [
        { label: 'Música', value: "Quadros - BK'" },
        { label: 'Filme', value: 'Forrest Gump' },
        { label: 'Série', value: 'The Office' },
        { label: 'Comida', value: 'Espaguete Carbonara' },
        { label: 'Países visitados', value: '+12' },
        { label: 'Hobbies', value: 'Futebol, Viagens, Jogos' },
      ],
      image: memoji.id,
      linksSubtitle: 'Links úteis',
    },
    career: {
      title: 'Construindo //\nEstudando',
      text: 'Quando você me contrata, leva junto a experiência de quem constrói produtos usados por milhões de pessoas todos os dias. As mesmas práticas que aplico em sistemas de grande escala entram no seu projeto.',
      experiences: [
        {
          type: 'work',
          company: 'L0gik',
          period: 'Abril, 2021 - Hoje',
          roles: ['Full Stack Developer', 'Design Engineer'],
          logo: logoL0gik.id,
          text: 'Engenharia, arquitetura e desenvolvimento de aplicações para diferentes segmentos, com foco em performance, escalabilidade e baixo custo de manutenção.',
          tags: ['TypeScript', 'Next.js', 'Node.js', 'N8N', 'Gitflow', 'Figma'],
          location: 'Rio de Janeiro, Brasil · Remoto · Tempo integral',
        },
        {
          type: 'education',
          company: 'Full Cycle',
          period: 'Janeiro, 2026 - Hoje',
          roles: ['Em andamento'],
          logo: logoFullCycle.id,
          text: 'Arquitetura, liderança e desenvolvimento de aplicações de grande e pequeno porte, com foco em sistemas distribuídos e boas práticas de mercado.',
          tags: ['DevOps', 'System Design', 'Microsserviços', 'DDD', 'Docker'],
          location: 'Meu Quarto · Remoto · Tempo integral',
        },
      ],
    },
  })

  await updatePage('uses-page', {
    meta: {
      title: 'Equipamentos — Gabriel da Silva',
      description:
        'O hardware, os apps e as ferramentas que uso todos os dias para projetar e desenvolver.',
    },
    subtitle: 'Equipamentos',
    title: 'Hardware // Apps // Tools\nDe Todos os Dias.',
    categories: [
      {
        title: 'Setup',
        icon: 'setup',
        items: [
          { name: "AOC Hero 27' 144hz", description: 'Monitor Principal | Horizontal' },
          { name: "Pichau Athen 27' 75hz", description: 'Monitor Secundário | Vertical' },
          { name: '5900x + RTX 3060', description: 'Computador | 32GB DDR4 RAM, 1TB NVMe SSD' },
          { name: 'MacBook Air (2025)', description: 'M4, macOS' },
          { name: 'Logitech G309', description: 'Mouse Gamer, Wireless e Bluetooth' },
          { name: 'Logitech G213', description: 'Teclado Gamer' },
          { name: 'Logitech Zone Vibe 100', description: 'Headset sem fio, Bluetooth' },
          { name: 'Desk Pad Couro', description: 'Mousepad Ecológico' },
          { name: 'Logitech C920e', description: 'Webcam' },
          { name: 'Ergonomia', description: 'Mesa de madeira sob medida e Cadeira presidente' },
        ],
      },
      {
        title: 'Gaming',
        icon: 'gaming',
        items: [
          { name: 'Playstation 5', description: '825GB, Edição Digital' },
          { name: "Samsung Odyssey G5 32' 165hz", description: 'Monitor gamer' },
          { name: 'Volante Logitech G29', description: 'Câmbio + Pedal' },
          { name: 'Soundbar Fortrek Black Hawk', description: 'Edição RGB 150hz' },
        ],
      },
      {
        title: 'Trabalho',
        icon: 'work',
        items: [
          { name: 'VSCode', description: 'Editor de texto', url: 'https://code.visualstudio.com' },
          {
            name: 'GitHub Theme',
            description: 'Tema de cores e ícones',
            url: 'https://github.com/primer/github-vscode-theme',
          },
          { name: 'Oh My Posh', description: 'Terminal', url: 'https://ohmyposh.dev' },
          {
            name: 'Docker Desktop',
            description: 'Gerenciamento de Containers',
            url: 'https://www.docker.com/products/docker-desktop',
          },
          { name: 'Figma', description: 'Ferramenta de UX/UI', url: 'https://www.figma.com' },
          {
            name: 'Adobe Creative Cloud',
            description: 'Central de apps Adobe',
            url: 'https://www.adobe.com/creativecloud.html',
          },
          {
            name: 'Navicat',
            description: 'Gerenciador de banco de dados',
            url: 'https://www.navicat.com',
          },
        ],
      },
      {
        title: 'Produtividade',
        icon: 'productivity',
        items: [
          {
            name: 'Notion',
            description: 'Gerenciador de tarefas/calendário',
            url: 'https://www.notion.so',
          },
          {
            name: 'Obsidian',
            description: 'Brainstorming, Mapa mental',
            url: 'https://obsidian.md',
          },
          {
            name: 'Firefox Developer Edition',
            description: 'Navegador principal',
            url: 'https://www.firefox.com/channel/desktop/developer',
          },
          {
            name: 'OBS Studio',
            description: 'Programa para gravação de tela',
            url: 'https://obsproject.com',
          },
          {
            name: 'Lightshot',
            description: 'Ferramenta de screenshots',
            url: 'https://app.prntscr.com',
          },
        ],
      },
      {
        title: 'Serviços',
        icon: 'services',
        items: [
          { name: 'Firebase', description: 'BaaS', url: 'https://firebase.google.com' },
          {
            name: 'Cloudflare',
            description: 'Gerenciamento de domínios',
            url: 'https://www.cloudflare.com',
          },
          { name: 'Vercel', description: 'Hospedagem gratuita', url: 'https://vercel.com' },
        ],
      },
    ],
  })

  await updatePage('home-page', {
    // The home takes its title, description and image from Configurações › SEO
    hero: {
      greeting: 'Olá!',
      title: 'Sou Gabriel da Silva',
      rolesLeft: 'Mid-Level\nFather of Cat',
      rolesLabel: 'e também sou',
      rolesRight: 'Full Stack Engineer\nInterface Designer',
      image: portrait.id,
      avatar: cat.id,
      ctaLabel: 'Eu quero',
      ctaTitle: 'Contratar',
      text: 'Possuo uma sólida formação em design, o que me permite contribuir para todas as etapas do desenvolvimento de produtos, sempre que necessário.',
    },
    beliefs: {
      title: 'No Que Eu Acredito // Cada Detalhe Conta.',
      items: [
        {
          title: 'Design não é enfeite',
          text: 'Uma interface bem pensada reduz dúvidas, aumenta a conversão e transmite confiança.',
        },
        {
          title: 'Performance é respeito',
          text: 'Um site rápido valoriza o tempo de quem usa, e seu cliente é convertido.',
        },
        {
          title: 'Código é para durar',
          text: 'Boas práticas hoje significam menos custo e menos retrabalho amanhã.',
        },
      ],
    },
    projects: {
      subtitle: 'Projetos',
      title: 'Produtos reais, no ar,\ngerando resultado.',
      text: 'Crio sites e produtos digitais para marcas que querem ser lembradas e precisam funcionar.',
      items: [kritica.id, brinov.id],
      buttonLabel: 'Ver todos',
    },
    cta: {
      // Runs of spaces offset the lines around the memoji, as in the design
      title: `Do zero {ao} deploy,${' '.repeat(36)}\n${' '.repeat(25)}// ou levando {o que você}\njá tem {para o} // próximo nível.`,
      image: memoji.id,
    },
    // Only "Sites & Apps" is open in the design; the other texts are placeholders to review
    services: [
      {
        title: 'Sites & Apps',
        icon: 'star',
        tagline: 'Presença digital que converte',
        text: 'Sites rápidos, responsivos e otimizados para SEO, feitos sob medida para a sua marca. Cada seção é pensada para guiar o visitante até a ação e transformar visita em contato.',
        tags: ['Institucionais', 'Mobile Apps', 'LPs de conversão', 'Blog', 'PWA'],
        case: broot.id,
      },
      {
        title: 'Design UI/UX',
        icon: 'pentagon',
        tagline: 'Interfaces que se entendem de primeira',
        text: 'Pesquisa, wireframes e interfaces no Figma, alinhadas à identidade da sua marca e validadas antes da primeira linha de código.',
        tags: ['UI Design', 'UX', 'Design System', 'Protótipos'],
      },
      {
        title: 'CMS & WordPress',
        icon: 'square',
        tagline: 'Autonomia total para o seu time',
        text: 'Sites com painel de gestão para o seu time atualizar textos, imagens e páginas sem depender de desenvolvedor.',
        tags: ['WordPress', 'Headless CMS', 'PayloadCMS', 'Strapi'],
      },
      {
        title: 'Back-end & APIs',
        icon: 'hexagon',
        tagline: 'A base que aguenta crescer',
        text: 'APIs, integrações e bancos de dados pensados para escalar com segurança e baixo custo de manutenção.',
        tags: ['Node.js', 'NestJS', 'PostgreSQL', 'Integrações'],
      },
      {
        title: 'IA aplicada',
        icon: 'diamond',
        tagline: 'Seu produto, mais inteligente.',
        text: 'Agentes, automações e recursos de inteligência artificial integrados ao seu produto para ganhar tempo e reduzir custos.',
        tags: ['AI Agents', 'Automações', 'OpenAI', 'Claude'],
      },
    ],
    about: {
      subtitle: 'Sobre',
      title: 'Design e engenharia a serviço do seu negócio.',
      text: doc(
        p(
          'Sou ',
          { bold: 'João Gabriel' },
          ', moro no Rio de Janeiro, Brasil. Sou ',
          { bold: 'Design Engineer' },
          ' e ',
          { bold: 'Desenvolvedor Full Stack' },
          ', com mais de 6 anos de experiência na criação de produtos digitais para empresas, agências e startups.',
        ),
        p(
          'Minha formação começou no design gráfico e evoluiu para o desenvolvimento de software. Essa combinação me permite conduzir um projeto do início ao fim: da estratégia e do design da ',
          { bold: 'interface até a arquitetura, o desenvolvimento e a publicação' },
          '. Com um único responsável técnico, o projeto ganha consistência, prazos mais previsíveis e menos retrabalho.',
        ),
      ),
      image: portrait.id,
      linkLabel: 'Saiba mais',
    },
    process: {
      title: `Do Pixel\n${' '.repeat(16)}// Ao Código.`,
      steps: [
        {
          title: 'Entender',
          text: 'Tudo começa com uma conversa para entender o seu negócio, seus objetivos e o público que você quer alcançar. Analiso referências, concorrentes e o que já existe hoje. Ao final, você recebe um escopo claro, com prazo definido e orçamento fechado, sem surpresas no meio do caminho.',
        },
        {
          title: 'Desenhar',
          text: 'Com o escopo aprovado, estruturo a navegação e a hierarquia de conteúdo em wireframes. Depois, crio a interface final no Figma, alinhada à identidade da sua marca. Você revisa e aprova cada tela antes da primeira linha de código, o que evita retrabalho e garante que o resultado seja exatamente o esperado.',
        },
        {
          title: 'Desenvolver',
          text: 'Com o layout aprovado, desenvolvo o projeto com código limpo, performance e SEO desde o início, mantendo você atualizado a cada etapa.',
        },
        {
          title: 'Lançar',
          text: 'Antes de ir ao ar, o projeto passa por testes em diferentes dispositivos e navegadores. Cuido do deploy, da configuração de domínio e da instalação de métricas. Depois da publicação, você conta com suporte para ajustes e com a documentação necessária para manter tudo funcionando.',
        },
      ],
    },
    payment: {
      subtitle: 'Praticidade',
      title: 'Pagamento fácil.\nInclusive em cripto.',
      coins: ['btc', 'eth', 'usdt', 'usdc', 'sol', 'bnb', 'xrp', 'ltc'],
    },
  })

  payload.logger.info('— Updating globals...')
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      seo: {
        title: 'Gabriel da Silva — Design Engineer e Desenvolvedor Full Stack',
        description:
          'Sites, plataformas e produtos digitais do design ao deploy. Design Engineer e desenvolvedor full stack no Rio de Janeiro.',
        image: ogDefault.id,
      },
      email: 'hi@gabsilva.dev',
      // The number is left empty on purpose: fill it in Configurações › Contato
      whatsapp: {
        number: '',
        message: 'Olá, Gabriel! Vim pelo seu site e quero conversar sobre um projeto.',
      },
      hire: { label: 'Quero contratar' },
      location: { city: 'Rio, Brasil', utc: 'UTC−3', timezone: 'America/Sao_Paulo' },
      // Placeholder URLs: replace with the real profiles in the admin
      socials: [
        { label: 'Meu CV', url: '#', icon: 'cv' },
        { label: 'WhatsApp', url: 'https://wa.me/', icon: 'whatsapp' },
        { label: 'Reddit', url: 'https://www.reddit.com/', icon: 'reddit' },
        { label: 'Spotify', url: 'https://open.spotify.com/', icon: 'spotify' },
        { label: 'DEV.to', url: 'https://dev.to/', icon: 'devto', showInFooter: true },
        { label: 'Dribbble', url: 'https://dribbble.com/', icon: 'dribbble', showInFooter: true },
        { label: 'GitHub', url: 'https://github.com/', icon: 'github', showInFooter: true },
        {
          label: 'Linkedin',
          url: 'https://www.linkedin.com/',
          icon: 'linkedin',
          showInFooter: true,
        },
        { label: 'X (Twitter)', url: 'https://x.com/', icon: 'x', showInFooter: true },
        {
          label: 'Instagram',
          url: 'https://www.instagram.com/',
          icon: 'instagram',
          showInFooter: true,
        },
        { label: 'Strava', url: 'https://www.strava.com/', icon: 'strava' },
        { label: 'Setup', url: '/equipamentos', icon: 'setup', highlight: true },
      ],
      stats: [
        { value: '+6', label: 'Anos transformando ideias em produto' },
        { value: '+28', label: 'Clientes e empresas atendidas' },
        { value: '+75', label: 'Projetos entregues com máxima satisfação' },
        { value: '+1MM', label: 'Pessoas impactadas por projetos desenvolvidos' },
      ],
      stack: [
        {
          title: 'Interface',
          items: [
            { name: 'Figma', years: '6y' },
            { name: 'Typescript', years: '4y' },
            { name: 'React', years: '4y' },
            { name: 'Next.js', years: '4y' },
            { name: 'Nuxt.js', years: '5y' },
            { name: 'Svelte', years: '4y' },
            { name: 'Tailwind CSS', years: '4y' },
          ],
        },
        {
          title: 'Engrenagem',
          items: [
            { name: 'Node.js', years: '4y' },
            { name: 'NestJS', years: '2y' },
            { name: 'MongoDB / PostgreSQL', years: '2y' },
            { name: 'REST APIs / Firebase / Supabase', years: '3y' },
            { name: 'GraphQL', years: '3y' },
            { name: 'Prisma / Drizzle', years: '3y' },
            { name: 'Strapi / PayloadCMS / WordPress', years: '6y' },
          ],
        },
        {
          title: 'Inteligência',
          items: [
            { name: 'Claude / OpenAI / AI Agents', years: '1y' },
            { name: 'GTM / GA4 / Tagging', years: '3y' },
            { name: 'E-commerce', years: '5y' },
            { name: 'GitHub Actions', years: '1y' },
            { name: 'Docker', years: '1y' },
            { name: 'Digital Ocean / AWS / Vercel', years: '4y' },
            { name: 'Cloudflare', years: '4y' },
          ],
        },
      ],
    },
    req,
    context,
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { label: 'Projetos', page: 'projects' },
        { label: 'Sobre', page: 'about' },
        { label: 'Equipamentos', page: 'uses' },
        { label: 'Artigos', page: 'articles', soon: true },
      ],
    },
    req,
    context,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      contact: { subtitle: 'Quero contratar', title: 'Tem uma ideia?\nVamos colocar no ar.' },
      legalText: 'CNPJ 48.827.582/0001-00 | Gabriel da Silva - Dev & Design Studio © {ano}',
      legalLinks: [privacy.id, terms.id],
    },
    req,
    context,
  })

  payload.logger.info('— Translating to English...')
  await translateToEnglish({
    payload,
    req,
    privacy: privacy.id,
    terms: terms.id,
    brinov: brinov.id,
    projects,
  })

  payload.logger.info('Seeded database successfully!')
}
