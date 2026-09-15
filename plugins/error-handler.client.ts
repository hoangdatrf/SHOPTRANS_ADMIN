export default defineNuxtPlugin(() => {
  // Xử lý unhandled promise rejections
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      // Bỏ qua lỗi ECONNABORTED - đây là lỗi phổ biến khi HMR connection bị ngắt
      if (event.reason?.code === 'ECONNABORTED' || 
          event.reason?.message?.includes('ECONNABORTED') ||
          event.reason?.errno === 'ECONNABORTED') {
        event.preventDefault()
        // Không log lỗi này vì nó không ảnh hưởng đến ứng dụng
        return
      }
      
      // Log các lỗi khác để debug
      console.warn('Unhandled promise rejection:', event.reason)
    })
  }
})

