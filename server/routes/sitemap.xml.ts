import {
  SHOPTRANS_DEFAULT_SITE_URL,
  SHOPTRANS_PUBLIC_SEO_ROUTES,
  buildAbsoluteUrl,
  normalizeSiteUrl
} from '~/utils/seo'

const escapeXml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(config.public.siteUrl || SHOPTRANS_DEFAULT_SITE_URL)
  const lastmod = '2026-05-27'
  const routes = SHOPTRANS_PUBLIC_SEO_ROUTES.filter((route) => !route.noindex && !route.canonicalPath)

  setHeader(event, 'content-type', 'application/xml; charset=UTF-8')

  const urls = routes.map((route) => {
    return [
      '  <url>',
      `    <loc>${escapeXml(buildAbsoluteUrl(siteUrl, route.path))}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${route.changefreq || 'monthly'}</changefreq>`,
      `    <priority>${route.priority ?? 0.5}</priority>`,
      '  </url>'
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>'
  ].join('\n')
})
