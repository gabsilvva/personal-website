import type { Payload, PayloadRequest } from 'payload'

import { doc, h2, p, ul } from './lexical'

// Skips the Next.js revalidation hooks while seeding
const context = { disableRevalidate: true }

/** Untranslated array rows: keep the Portuguese row as it is. */
const same = {}

/**
 * Lays the English texts over the Portuguese document. Array rows are matched by position so
 * their ids, images, icons and order are kept; plain value lists (tags) and rich text are replaced.
 */
const overlay = (base: unknown, patch: unknown): unknown => {
  if (patch === undefined) return base

  if (Array.isArray(patch)) {
    const rows = patch.some((item) => item && typeof item === 'object')
    if (!rows || !Array.isArray(base)) return patch
    return base.map((item, index) => overlay(item, patch[index]))
  }

  if (patch && typeof patch === 'object' && !('root' in patch)) {
    const source = (base ?? {}) as Record<string, unknown>
    return Object.fromEntries(
      [...new Set([...Object.keys(source), ...Object.keys(patch)])].map((key) => [
        key,
        overlay(source[key], (patch as Record<string, unknown>)[key]),
      ]),
    )
  }

  return patch
}

// System fields that must not be written back
const strip = ({
  id: _id,
  globalType: _g,
  createdAt: _c,
  updatedAt: _u,
  _order: _o,
  ...data
}: Record<string, unknown>) => data

type Args = {
  payload: Payload
  req: PayloadRequest
  privacy: number
  terms: number
  brinov: number
  projects: Array<{
    id: number
    title: string
    client?: string | null
    technologies?: string[] | null
  }>
}

export const translateToEnglish = async ({
  payload,
  req,
  privacy,
  terms,
  brinov,
  projects,
}: Args) => {
  const global = async (
    slug:
      'home-page' | 'about-page' | 'projects-page' | 'uses-page' | 'settings' | 'header' | 'footer',
    en: unknown,
  ) => {
    const base = await payload.findGlobal({ slug, locale: 'pt', depth: 0, req })
    await payload.updateGlobal({
      slug,
      locale: 'en',
      data: overlay(strip(base as unknown as Record<string, unknown>), en) as never,
      req,
      context,
    })
  }

  const document = async (collection: 'pages' | 'projects', id: number, en: unknown) => {
    const base = await payload.findByID({ collection, id, locale: 'pt', depth: 0, req })
    await payload.update({
      collection,
      id,
      locale: 'en',
      data: overlay(strip(base as unknown as Record<string, unknown>), en) as never,
      req,
      context,
    })
  }

  await global('settings', {
    seo: {
      title: 'Gabriel da Silva — Design Engineer & Full Stack Developer',
      description:
        'Websites, platforms and digital products from design to deploy. Design Engineer and full stack developer based in Rio de Janeiro.',
    },
    whatsapp: { message: "Hi Gabriel! I found your website and I'd like to talk about a project." },
    hire: { label: 'Hire me' },
    location: { city: 'Rio, Brazil' },
    socials: [
      { label: 'My CV' },
      same,
      same,
      same,
      same,
      same,
      same,
      same,
      same,
      same,
      same,
      { url: '/en/uses' },
    ],
    stats: [
      { label: 'Years turning ideas into products' },
      { label: 'Clients and companies served' },
      { label: 'Projects delivered to full satisfaction' },
      { label: 'People reached by the projects I built' },
    ],
    stack: [{ title: 'Interface' }, { title: 'Engine' }, { title: 'Intelligence' }],
  })

  await global('header', {
    navItems: [{ label: 'Projects' }, { label: 'About' }, { label: 'Uses' }, { label: 'Articles' }],
  })

  await global('footer', {
    contact: { subtitle: 'Hire me', title: "Got an idea?\nLet's put it online." },
    legalText: 'CNPJ 48.827.582/0001-00 | Gabriel da Silva - Dev & Design Studio © {year}',
  })

  await global('home-page', {
    hero: {
      greeting: 'Hi!',
      title: "I'm Gabriel da Silva",
      rolesLeft: 'Mid-Level\nCat Dad',
      rolesLabel: "and I'm also a",
      rolesRight: 'Full Stack Engineer\nInterface Designer',
      ctaLabel: 'I want to',
      ctaTitle: 'Hire you',
      text: 'I have a solid background in design, which lets me contribute to every stage of product development whenever needed.',
    },
    beliefs: {
      title: 'What I Believe // Every Detail Matters.',
      items: [
        {
          title: 'Design is not decoration',
          text: 'A well-thought-out interface removes doubts, increases conversion and builds trust.',
        },
        {
          title: 'Performance is respect',
          text: 'A fast website values your visitors’ time, and turns them into customers.',
        },
        {
          title: 'Code is meant to last',
          text: 'Good practices today mean lower costs and less rework tomorrow.',
        },
      ],
    },
    projects: {
      subtitle: 'Projects',
      title: 'Real products, live,\ndelivering results.',
      text: 'I build websites and digital products for brands that want to be remembered and need to perform.',
      buttonLabel: 'View all',
    },
    cta: {
      // Runs of spaces offset the lines around the memoji, as in the design
      title: `Zero {to} deploy,${' '.repeat(28)}\n${' '.repeat(18)}// or taking {what you}\nalready have {to the} // next level.`,
    },
    services: [
      {
        title: 'Sites & Apps',
        tagline: 'A digital presence that converts',
        text: 'Fast, responsive, SEO-optimized websites tailored to your brand. Every section is designed to guide visitors to action and turn visits into leads.',
        tags: ['Corporate sites', 'Mobile Apps', 'Landing pages', 'Blog', 'PWA'],
      },
      {
        title: 'UI/UX Design',
        tagline: 'Interfaces that make sense at first glance',
        text: 'Research, wireframes and Figma interfaces aligned with your brand identity and approved before the first line of code.',
        tags: ['UI Design', 'UX', 'Design System', 'Prototypes'],
      },
      {
        title: 'CMS & WordPress',
        tagline: 'Full autonomy for your team',
        text: 'Websites with an admin panel so your team can update copy, images and pages without depending on a developer.',
      },
      {
        title: 'Back-end & APIs',
        tagline: 'A foundation built to grow',
        text: 'APIs, integrations and databases designed to scale securely with low maintenance costs.',
        tags: ['Node.js', 'NestJS', 'PostgreSQL', 'Integrations'],
      },
      {
        title: 'Applied AI',
        tagline: 'Your product, smarter.',
        text: 'Agents, automations and AI features built into your product to save time and cut costs.',
        tags: ['AI Agents', 'Automations', 'OpenAI', 'Claude'],
      },
    ],
    about: {
      subtitle: 'About',
      title: 'Design and engineering at the service of your business.',
      linkLabel: 'Learn more',
      text: doc(
        p(
          "I'm ",
          { bold: 'João Gabriel' },
          ', based in Rio de Janeiro, Brazil. I’m a ',
          { bold: 'Design Engineer' },
          ' and ',
          { bold: 'Full Stack Developer' },
          ' with over 6 years of experience building digital products for companies, agencies and startups.',
        ),
        p(
          'My background started in graphic design and evolved into software development. This combination lets me lead a project from start to finish: from strategy and ',
          { bold: 'interface design to architecture, development and launch' },
          '. With a single technical lead, the project gains consistency, more predictable deadlines and less rework.',
        ),
      ),
    },
    process: {
      title: `From Pixel\n${' '.repeat(16)}// To Code.`,
      steps: [
        {
          title: 'Understand',
          text: 'It all starts with a conversation to understand your business, your goals and the audience you want to reach. I review references, competitors and what you already have. In the end, you get a clear scope with a set deadline and a fixed budget, with no surprises along the way.',
        },
        {
          title: 'Design',
          text: 'With the scope approved, I structure navigation and content hierarchy in wireframes. Then I design the final interface in Figma, aligned with your brand identity. You review and approve every screen before the first line of code, which avoids rework and ensures the result is exactly what you expected.',
        },
        {
          title: 'Develop',
          text: 'With the layout approved, I build the project with clean code, performance and SEO from the start, keeping you updated at every step.',
        },
        {
          title: 'Launch',
          text: 'Before going live, the project is tested across devices and browsers. I handle the deploy, domain setup and analytics. After launch, you get support for adjustments and the documentation needed to keep everything running.',
        },
      ],
    },
    payment: {
      subtitle: 'Convenience',
      title: 'Easy payment.\nCrypto included.',
    },
  })

  await global('about-page', {
    meta: {
      title: 'About — Gabriel da Silva',
      description:
        'Over 6 years building digital products end to end. Learn about my story, my career and the stack I use.',
    },
    hero: {
      title: 'Over 6 years\n{building digital}\n{products} // end to end.',
      subtitle: "Hi, I'm João Gabriel",
      text: "Today I'm a Mid-Level Software Engineer at L0gik, building solutions that have reached around 12 million users. I also take on freelance projects and study the architecture of large-scale applications.",
    },
    story: {
      subtitle: 'Story',
      linksSubtitle: 'Useful links',
      text: doc(
        p(
          "I've been working in digital since 2019. That's over ",
          { bold: '6 years between design and code' },
          ', building ',
          { bold: 'websites, platforms and products for companies of all sizes' },
          '.',
        ),
        p(
          'My journey started in graphic design, creating pieces and visual identities. Within a few months I discovered programming, joined as a front-end intern and ',
          { bold: 'was promoted in just 6 months' },
          '. Since then, I’ve never separated the two: ',
          { bold: 'I design with code in mind and code with the user in mind' },
          '.',
        ),
        p(
          'In recent years, ',
          { bold: 'my projects have reached around 12 million people' },
          ', in products for agencies, startups and major brands. Today, ',
          {
            bold: 'my focus is helping companies grow online with fast, beautiful solutions built to last',
          },
          '.',
        ),
      ),
      favorites: [
        { label: 'Music' },
        { label: 'Movie' },
        { label: 'Series' },
        { label: 'Food', value: 'Spaghetti Carbonara' },
        { label: 'Countries visited' },
        { label: 'Hobbies', value: 'Football, Travel, Games' },
      ],
    },
    career: {
      title: 'Building //\nLearning',
      text: 'When you hire me, you get the experience of someone who builds products used by millions of people every day. The same practices I apply to large-scale systems go into your project.',
      experiences: [
        {
          period: 'April 2021 - Present',
          text: 'Engineering, architecture and development of applications for different industries, focused on performance, scalability and low maintenance costs.',
          location: 'Rio de Janeiro, Brazil · Remote · Full-time',
        },
        {
          period: 'January 2026 - Present',
          roles: ['In progress'],
          text: 'Architecture, leadership and development of large and small applications, focused on distributed systems and industry best practices.',
          tags: ['DevOps', 'System Design', 'Microservices', 'DDD', 'Docker'],
          location: 'My bedroom · Remote · Full-time',
        },
      ],
    },
  })

  await global('projects-page', {
    meta: {
      title: 'Projects — Gabriel da Silva',
      description:
        'Websites, platforms and digital products I built for companies across industries, from design to code.',
    },
    banner: {
      subtitle: 'Projects',
      title: 'Work that\nspeaks for me',
      text: 'I help companies across industries get off the drawing board and grow online. Here are some of my latest projects.',
    },
  })

  await global('uses-page', {
    meta: {
      title: 'Uses — Gabriel da Silva',
      description: 'The hardware, apps and tools I use every day to design and build.',
    },
    subtitle: 'Uses',
    title: 'Hardware // Apps // Tools\nI Use Every Day.',
    categories: [
      {
        title: 'Setup',
        items: [
          { description: 'Main monitor | Horizontal' },
          { description: 'Secondary monitor | Vertical' },
          { description: 'Desktop | 32GB DDR4 RAM, 1TB NVMe SSD' },
          same,
          { description: 'Gaming mouse, Wireless and Bluetooth' },
          { description: 'Gaming keyboard' },
          { description: 'Wireless headset, Bluetooth' },
          { name: 'Leather Desk Pad', description: 'Eco-friendly mousepad' },
          same,
          { name: 'Ergonomics', description: 'Custom wooden desk and executive chair' },
        ],
      },
      {
        title: 'Gaming',
        items: [
          { description: '825GB, Digital Edition' },
          { description: 'Gaming monitor' },
          { name: 'Logitech G29 Racing Wheel', description: 'Shifter + Pedals' },
          { description: 'RGB Edition 150hz' },
        ],
      },
      {
        title: 'Work',
        items: [
          { description: 'Code editor' },
          { description: 'Color and icon theme' },
          same,
          { description: 'Container management' },
          { description: 'UX/UI tool' },
          { description: 'Adobe apps hub' },
          { description: 'Database manager' },
        ],
      },
      {
        title: 'Productivity',
        items: [
          { description: 'Tasks and calendar' },
          { description: 'Brainstorming, mind maps' },
          { description: 'Main browser' },
          { description: 'Screen recording' },
          { description: 'Screenshot tool' },
        ],
      },
      {
        title: 'Services',
        items: [same, { description: 'Domain management' }, { description: 'Free hosting' }],
      },
    ],
  })

  // Every project gets an English description; Brinov also has its page text translated below
  for (const project of projects.filter((item) => item.id !== brinov)) {
    await document('projects', project.id, {
      meta: {
        description: `${project.title} for ${project.client}, built with ${project.technologies?.join(', ')}.`,
      },
    })
  }

  await document('projects', brinov, {
    meta: {
      description:
        'The site was built with Next.js and headless WordPress, combining the speed of a modern application with the autonomy of a CMS the team already knows.',
    },
    summary:
      'The site was built with Next.js and headless WordPress, combining the speed of a modern application with the autonomy of a CMS the team already knows.',
    intro:
      'A {new website} for a consultancy that brings technology, savings and convenience to companies {all over Brazil. Tailor-made design}, top-notch performance and {content designed to be found on Google and by AI}.',
    description: doc(
      p(
        'Brinov is an IT consultancy from Curitiba that, since 2012, has helped companies buy and manage software such as Microsoft 365, Google Workspace and security solutions. I was responsible for the project end to end: layout, interface design and development.',
      ),
      p(
        'The structure was optimized for SEO and GEO, ensuring visibility both in search engines and in AI answers.',
      ),
    ),
    specs: {
      service: 'Layout, Website, CMS',
      solution: 'Website',
      industry: 'Technology',
    },
  })

  await document('pages', privacy, {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    meta: {
      title: 'Privacy Policy — Gabriel da Silva',
      description:
        "How visitor data on Gabriel da Silva's website is handled, in accordance with Brazil's LGPD.",
    },
    content: doc(
      p(
        'This Privacy Policy explains how João Gabriel da Silva ("I") handles the information of visitors to this website, in accordance with the Brazilian General Data Protection Law (Law No. 13,709/2018, LGPD).',
      ),
      h2('1. Data collected'),
      p('This website has no forms or sign-up area. The only data processed is:'),
      ul(
        [
          'Browsing data: anonymous information such as pages visited, time on page, device type, browser and approximate location, collected by analytics tools.',
        ],
        [
          'Contact data: when you click the WhatsApp button, the conversation happens outside this website. The name, number and messages you send are used only to reply to you and work on a possible proposal.',
        ],
      ),
      h2('2. Purpose'),
      p('The data is used to:'),
      ul(
        ['Understand how the website is used and improve your experience;'],
        ['Reply to contacts and send business proposals;'],
        ['Comply with legal obligations, when required.'],
      ),
      p('I do not sell, rent or share your data with third parties for marketing purposes.'),
      h2('3. Cookies'),
      p(
        'This website may use cookies for traffic and performance analysis. You can disable them at any time in your browser settings without losing access to the content.',
      ),
      h2('4. Third-party services'),
      p('Some external services may process data according to their own policies:'),
      ul(
        ['WhatsApp (Meta): contact channel;'],
        ['[Analytics tool, e.g. Google Analytics or Vercel Analytics]: traffic metrics;'],
        ['[Hosting provider, e.g. Vercel]: website hosting;'],
        [
          'Social networks: the links to Dribbble, GitHub, LinkedIn and Instagram lead to external platforms.',
        ],
      ),
      h2('5. Cryptocurrency payments'),
      p(
        'Cryptocurrency payments are arranged directly with me, outside the website. Blockchain transactions are public and irreversible by nature. Wallet addresses are used only to confirm receipt.',
      ),
      h2('6. Storage and security'),
      p(
        'Data is kept only for as long as needed to fulfill the purposes described. I take reasonable technical measures to protect information against unauthorized access.',
      ),
      h2('7. Your rights'),
      p(
        'Under the LGPD, you may at any time request access, correction, anonymization or deletion of your data, and withdraw your consent. Just get in touch by e-mail.',
      ),
      h2('8. Contact'),
      p('Questions about this policy: ', {
        link: 'hi@gabsilva.dev',
        url: 'mailto:hi@gabsilva.dev',
      }),
    ),
  })

  await document('pages', terms, {
    title: 'Terms of Use',
    slug: 'terms-of-use',
    meta: {
      title: 'Terms of Use — Gabriel da Silva',
      description:
        "Terms for using Gabriel da Silva's website and portfolio: intellectual property, hiring and payments.",
    },
    content: doc(
      p(
        'By accessing this website, you agree to the terms below. If you do not agree, I recommend not using it.',
      ),
      h2('1. About the website'),
      p(
        'This is the personal website and portfolio of João Gabriel da Silva, meant to present services, projects and ways to get in touch. Its content is informative and does not constitute a business proposal.',
      ),
      h2('2. Intellectual property'),
      p(
        'Texts, layout, images, code and visual identity on this website are my own work, unless stated otherwise, and may not be copied or reproduced without permission. Client brands, logos and projects shown in the portfolio belong to their respective owners and are presented only as examples of my work.',
      ),
      h2('3. Hiring services'),
      p(
        'Prices, deadlines, scope and payment methods are defined in a specific proposal or contract for each project. The information on this website does not replace that agreement.',
      ),
      h2('4. Cryptocurrency payments'),
      p(
        'When accepted, cryptocurrency payments have their amount set in Brazilian reais or US dollars and converted at the rate at the time of payment. The client is responsible for sending the correct amount to the address and network provided. Blockchain transactions are irreversible, and payments sent to the wrong address or network cannot be recovered.',
      ),
      h2('5. External links'),
      p(
        'The website contains links to third-party services such as WhatsApp and social networks. I am not responsible for the content or privacy practices of those platforms.',
      ),
      h2('6. Limitation of liability'),
      p(
        'I strive to keep the information on this website accurate and up to date, but I do not guarantee it is error-free or always available. I am not liable for damages arising from the use of the information published here.',
      ),
      h2('7. Changes'),
      p(
        'These terms may be updated at any time. The date of the last update is always shown at the top of this page.',
      ),
      h2('8. Governing law and jurisdiction'),
      p(
        'These terms are governed by Brazilian law. The courts of Rio de Janeiro/RJ are chosen to settle any disputes.',
      ),
      h2('9. Contact'),
      p('Questions about these terms: ', {
        link: 'hi@gabsilva.dev',
        url: 'mailto:hi@gabsilva.dev',
      }),
    ),
  })
}
