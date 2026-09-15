export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://www.macmap.org/api/products?countryCode=842&level=6', {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Referer': 'https://www.macmap.org/'
      }
    })

    if (!response.ok) {
      throw new Error(`MacMap responded with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching MacMap HS codes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch HS codes from MacMap'
    })
  }
})
