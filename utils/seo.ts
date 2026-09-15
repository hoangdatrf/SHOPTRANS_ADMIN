export type ShoptransSeoRoute = {
  path: string
  title: string
  description: string
  keywords?: string[]
  image?: string
  canonicalPath?: string
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: number
  noindex?: boolean
}

export const SHOPTRANS_SITE_NAME = 'SHOPTRANS'
export const SHOPTRANS_DEFAULT_SITE_URL = 'https://shoptrans.com'
export const SHOPTRANS_DEFAULT_IMAGE = '/hero-background.jpg'
export const SHOPTRANS_DEFAULT_TITLE = 'SHOPTRANS - Digital Logistics, Freight Quotes and Tracking'
export const SHOPTRANS_DEFAULT_DESCRIPTION =
  'SHOPTRANS is a digital logistics platform for instant freight quotations, online booking, shipment tracking, customs clearance and end-to-end supply chain visibility.'

const sharedKeywords = [
  'digital logistics',
  'freight forwarding',
  'shipment tracking',
  'instant freight quote',
  'ocean freight',
  'customs clearance',
  'supply chain visibility'
]

export const SHOPTRANS_PUBLIC_SEO_ROUTES: ShoptransSeoRoute[] = [
  {
    path: '/',
    title: 'Digital Logistics, Freight Quotes and Tracking',
    description:
      'Quote, book and track shipments across sea, air, road and rail with SHOPTRANS, an end-to-end logistics platform for modern freight forwarding.',
    keywords: sharedKeywords,
    image: SHOPTRANS_DEFAULT_IMAGE,
    changefreq: 'weekly',
    priority: 1
  },
  {
    path: '/products',
    title: 'Freight Products and Logistics Services',
    description:
      'Explore SHOPTRANS freight products for FCL, LCL, air cargo, customs clearance, insurance, collect charges and delivery services.',
    keywords: ['freight products', 'FCL service', 'LCL service', 'air cargo', ...sharedKeywords],
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/solutions',
    title: 'End-to-End Logistics Solutions',
    description:
      'Discover multimodal logistics solutions, transport terms, overseas booking, trading support and value-added supply chain services.',
    keywords: ['logistics solutions', 'multimodal transport', 'EXW FCA DAP DDP', ...sharedKeywords],
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/tracking',
    title: 'Shipment Tracking',
    description:
      'Track ocean, LCL and air shipments by container number, bill of lading or SHOPTRANS reference with milestone visibility.',
    keywords: ['shipment tracking', 'container tracking', 'bill of lading tracking', ...sharedKeywords],
    changefreq: 'daily',
    priority: 0.85
  },
  {
    path: '/schedules',
    title: 'Vessel Schedules',
    description:
      'Search vessel schedules, origin and destination ports, sailing options and transit times for international cargo shipments.',
    keywords: ['vessel schedules', 'sailing schedule', 'port schedule', ...sharedKeywords],
    changefreq: 'daily',
    priority: 0.8
  },
  {
    path: '/quote-request',
    title: 'Freight Quote Request',
    description:
      'Request freight quotes and compare international logistics options for cargo moving by sea, air, road or rail.',
    keywords: ['freight quote request', 'shipping quote', 'instant quotation', ...sharedKeywords],
    changefreq: 'weekly',
    priority: 0.85
  },
  {
    path: '/lcl',
    title: 'LCL Freight Quote',
    description:
      'Build LCL shipment requests, compare logistics services and prepare booking details for less-than-container-load cargo.',
    keywords: ['LCL quote', 'less than container load', 'LCL freight', ...sharedKeywords],
    changefreq: 'weekly',
    priority: 0.75
  },
  {
    path: '/customs-clearance',
    title: 'Customs Clearance Services',
    description:
      'SHOPTRANS supports import and export customs clearance, declaration handling, document review and destination compliance.',
    keywords: ['customs clearance', 'customs broker', 'import customs', 'export customs', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.75
  },
  {
    path: '/local-information',
    title: 'Local Import and Export Information',
    description:
      'Find country-specific import, export, payment, customs, demurrage, detention and document information for logistics operations.',
    keywords: ['local information', 'import regulations', 'export procedures', 'demurrage detention', ...sharedKeywords],
    changefreq: 'weekly',
    priority: 0.75
  },
  {
    path: '/local-info',
    title: 'Local Import and Export Information',
    description:
      'Find country-specific import, export, payment, customs, demurrage, detention and document information for logistics operations.',
    keywords: ['local information', 'import regulations', 'export procedures', 'demurrage detention', ...sharedKeywords],
    canonicalPath: '/local-information',
    noindex: true
  },
  {
    path: '/payment-solutions',
    title: 'Cross-Border Payment Solutions',
    description:
      'Manage cross-border collect and pay charges, payment instructions and logistics-related financial workflows with SHOPTRANS.',
    keywords: ['cross-border payment', 'collect charges', 'pay charges', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.65
  },
  {
    path: '/shoptrans-network',
    title: 'Global Logistics Network',
    description:
      'View the SHOPTRANS logistics network across Asia, the Americas and Europe, with support for global freight operations.',
    keywords: ['global logistics network', 'freight network', 'logistics offices', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/partners',
    title: 'SHOPTRANS Partners',
    description:
      'Learn about SHOPTRANS partner capabilities across carriers, agents, customs providers and logistics service networks.',
    keywords: ['logistics partners', 'carrier partners', 'freight partners', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.65
  },
  {
    path: '/about-shoptrans',
    title: 'About SHOPTRANS',
    description:
      'Learn how SHOPTRANS connects freight quotation, online booking, tracking, risk management and payment execution in one platform.',
    keywords: ['about SHOPTRANS', 'digital freight platform', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.65
  },
  {
    path: '/contact-shoptrans',
    title: 'Contact SHOPTRANS',
    description:
      'Contact SHOPTRANS offices and logistics teams for freight forwarding, customs, booking and shipment support across global markets.',
    keywords: ['contact logistics company', 'SHOPTRANS office', 'freight support', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.75
  },
  {
    path: '/fast-and-conveniences',
    title: 'Fast and Convenient Freight Tools',
    description:
      'Use SHOPTRANS freight tools to speed up quotations, bookings, shipment visibility and logistics coordination.',
    keywords: ['freight tools', 'logistics platform', 'online booking', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/learn-more',
    title: 'Learn More About SHOPTRANS',
    description:
      'Learn more about SHOPTRANS technology, freight services, logistics execution and supply chain visibility features.',
    keywords: ['learn logistics platform', 'SHOPTRANS technology', ...sharedKeywords],
    changefreq: 'monthly',
    priority: 0.55
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions',
    description:
      'Read SHOPTRANS terms and conditions for platform access, logistics services, bookings, payments and related usage.',
    keywords: ['SHOPTRANS terms', 'terms and conditions'],
    changefreq: 'yearly',
    priority: 0.35
  }
]

export const SHOPTRANS_NOINDEX_PREFIXES = [
  '/admin',
  '/bookings',
  '/fcl',
  '/fcl_temp',
  '/finance-task',
  '/login',
  '/my-account',
  '/register',
  '/shipment-detail',
  '/shipment-journey',
  '/submit-si',
  '/support',
  '/unauthorized'
]

export function normalizeSiteUrl(value?: string | null) {
  const siteUrl = value?.trim() || SHOPTRANS_DEFAULT_SITE_URL
  return siteUrl.replace(/\/+$/, '')
}

export function normalizePath(path?: string | null) {
  if (!path || path === '/') return '/'
  const cleanPath = path.split('?')[0].split('#')[0]
  return `/${cleanPath.replace(/^\/+/, '').replace(/\/+$/, '')}`
}

export function buildAbsoluteUrl(siteUrl: string, path = '/') {
  const normalizedPath = normalizePath(path)
  return `${normalizeSiteUrl(siteUrl)}${normalizedPath === '/' ? '/' : normalizedPath}`
}

export function formatSeoTitle(title?: string | null) {
  if (!title) return SHOPTRANS_DEFAULT_TITLE
  return title.includes(SHOPTRANS_SITE_NAME) ? title : `${title} | ${SHOPTRANS_SITE_NAME}`
}

export function findShoptransRouteSeo(path?: string | null) {
  const normalizedPath = normalizePath(path)
  return SHOPTRANS_PUBLIC_SEO_ROUTES.find((route) => route.path === normalizedPath)
}

export function isShoptransNoindexPath(path?: string | null) {
  const normalizedPath = normalizePath(path)
  return SHOPTRANS_NOINDEX_PREFIXES.some((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`))
}
