export const toast = {
  success(title: string, description?: string) {
    console.log('[toast:success]', title, description ?? '')
    window.alert(description ? `${title}\n${description}` : title)
  },
  error(title: string, description?: string) {
    console.error('[toast:error]', title, description ?? '')
    window.alert(description ? `${title}\n${description}` : title)
  },
}
