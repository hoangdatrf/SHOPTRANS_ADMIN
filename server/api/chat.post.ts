export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('body', body)
  try {
    const response = await $fetch('http://n8n-64.nzt.vn/webhook/87cd4565-a6b7-4d22-b0da-31a3c710b552/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
    return response
  } catch (error) {
    console.error('Proxy error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to proxy request to n8n',
    })
  }
}) 