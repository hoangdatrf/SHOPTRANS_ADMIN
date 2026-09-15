import {
  SHOPTRANS_DEFAULT_DESCRIPTION,
  SHOPTRANS_DEFAULT_IMAGE,
  SHOPTRANS_DEFAULT_SITE_URL,
  SHOPTRANS_SITE_NAME,
  buildAbsoluteUrl,
  findShoptransRouteSeo,
  formatSeoTitle,
  isShoptransNoindexPath,
  normalizePath,
  normalizeSiteUrl
} from '~/utils/seo'

type UseShoptransSeoInput = {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  canonicalPath?: string
  noindex?: boolean
}

export function useShoptransSeo(input: UseShoptransSeoInput = {}) {
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteUrl = computed(() => normalizeSiteUrl(config.public.siteUrl || SHOPTRANS_DEFAULT_SITE_URL))
  const routeSeo = computed(() => findShoptransRouteSeo(route.path))
  const title = computed(() => formatSeoTitle(input.title || routeSeo.value?.title))
  const description = computed(() => input.description || routeSeo.value?.description || SHOPTRANS_DEFAULT_DESCRIPTION)
  const keywords = computed(() => input.keywords || routeSeo.value?.keywords || [])
  const canonicalPath = computed(() => input.canonicalPath || routeSeo.value?.canonicalPath || normalizePath(route.path))
  const canonicalUrl = computed(() => buildAbsoluteUrl(siteUrl.value, canonicalPath.value))
  const imageUrl = computed(() => buildAbsoluteUrl(siteUrl.value, input.image || routeSeo.value?.image || SHOPTRANS_DEFAULT_IMAGE))
  const shouldNoindex = computed(() => input.noindex ?? routeSeo.value?.noindex ?? isShoptransNoindexPath(route.path))

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: imageUrl,
    ogSiteName: SHOPTRANS_SITE_NAME,
    ogType: 'website',
    ogUrl: canonicalUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl,
    robots: computed(() => shouldNoindex.value ? 'noindex, nofollow' : 'index, follow')
  })

  useHead(() => {
    const keywordContent = keywords.value.join(', ')
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SHOPTRANS_SITE_NAME,
      url: siteUrl.value,
      logo: buildAbsoluteUrl(siteUrl.value, '/logo.png'),
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@shoptrans.com',
        contactType: 'customer support',
        availableLanguage: ['English']
      }
    }
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SHOPTRANS_SITE_NAME,
      url: siteUrl.value
    }
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title.value,
      url: canonicalUrl.value,
      description: description.value,
      isPartOf: {
        '@type': 'WebSite',
        name: SHOPTRANS_SITE_NAME,
        url: siteUrl.value
      }
    }

    return {
      link: [
        { key: 'canonical', rel: 'canonical', href: canonicalUrl.value }
      ],
      meta: [
        { key: 'keywords', name: 'keywords', content: keywordContent },
        { key: 'author', name: 'author', content: SHOPTRANS_SITE_NAME },
        { key: 'theme-color', name: 'theme-color', content: '#00a86b' },
        { key: 'application-name', name: 'application-name', content: SHOPTRANS_SITE_NAME },
        { key: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: SHOPTRANS_SITE_NAME }
      ],
      script: [
        {
          key: 'ld-json-organization',
          type: 'application/ld+json',
          children: JSON.stringify(organizationSchema)
        },
        {
          key: 'ld-json-website',
          type: 'application/ld+json',
          children: JSON.stringify(websiteSchema)
        },
        {
          key: 'ld-json-webpage',
          type: 'application/ld+json',
          children: JSON.stringify(webPageSchema)
        }
      ]
    }
  })
}
