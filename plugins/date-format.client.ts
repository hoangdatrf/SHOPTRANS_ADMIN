// One date format for the whole Admin: dd/mm/yyyy (and dd/mm/yyyy hh:mm).
//
// 1. Native <input type="date"/"datetime-local"> render their text in the
//    browser/OS locale (10/30/2026, 2026-10-30, ...). Their own text is hidden and
//    the value is painted as dd/mm/yyyy instead. The stored value (yyyy-mm-dd) is
//    unchanged, so v-model and every save keep working.
// 2. Text on screen written as yyyy-mm-dd or yyyy/mm/dd (timestamps, history
//    tables, status details...) is rewritten to dd/mm/yyyy for display only.

const ISO_TEXT = /\b(\d{4})[-/](\d{2})[-/](\d{2})(?![\d/-])/g
const DATE_TYPES = new Set(['date', 'datetime-local'])
const SKIP_PARENTS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'])

const displayValue = (input: HTMLInputElement) => {
  const value = String(input.value || '')
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/)
  if (!match) return { text: input.type === 'datetime-local' ? 'dd/mm/yyyy --:--' : 'dd/mm/yyyy', empty: true }
  const date = `${match[3]}/${match[2]}/${match[1]}`
  return { text: match[4] ? `${date} ${match[4]}:${match[5]}` : date, empty: false }
}

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char] as string))

const paint = (input: HTMLInputElement) => {
  if (!DATE_TYPES.has(input.type)) {
    if (input.classList.contains('dmy-date')) {
      input.classList.remove('dmy-date')
      input.style.removeProperty('background-image')
    }
    return
  }
  const style = window.getComputedStyle(input)
  const { text, empty } = displayValue(input)
  const color = empty ? '#9aa5b1' : style.color
  const align = style.textAlign === 'center' ? 'middle' : style.textAlign === 'right' || style.textAlign === 'end' ? 'end' : 'start'
  const x = align === 'middle' ? '50%' : align === 'end' ? `calc(100% - ${parseFloat(style.paddingRight) + 24}px)` : `${parseFloat(style.paddingLeft) || 0}px`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><text x="${x}" y="50%" dominant-baseline="central" text-anchor="${align}" fill="${escapeXml(color)}" font-family="${escapeXml(style.fontFamily)}" font-size="${escapeXml(style.fontSize)}" font-weight="${escapeXml(style.fontWeight)}">${escapeXml(text)}</text></svg>`
  input.classList.add('dmy-date')
  input.style.setProperty('background-image', `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`)
}

const rewriteText = (node: Text) => {
  const parent = node.parentElement
  if (!parent || SKIP_PARENTS.has(parent.tagName) || parent.isContentEditable) return
  const text = node.nodeValue || ''
  if (!/\d{4}[-/]\d{2}[-/]\d{2}/.test(text)) return
  const next = text.replace(ISO_TEXT, (_all, year, month, day) => `${day}/${month}/${year}`)
  if (next !== text) node.nodeValue = next
}

const scan = (root: Node) => {
  if (root.nodeType === Node.TEXT_NODE) return rewriteText(root as Text)
  if (!(root instanceof Element)) return
  if (root instanceof HTMLInputElement) return paint(root)
  root.querySelectorAll<HTMLInputElement>('input').forEach(paint)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) rewriteText(node as Text)
}

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const style = document.createElement('style')
  style.textContent = `
    input.dmy-date{background-repeat:no-repeat!important;background-position:0 0!important;background-size:100% 100%!important}
    input.dmy-date::-webkit-datetime-edit{color:transparent!important}
    input.dmy-date::-webkit-datetime-edit-fields-wrapper{color:transparent!important}
    input.dmy-date::-webkit-datetime-edit-text,input.dmy-date::-webkit-datetime-edit-day-field,
    input.dmy-date::-webkit-datetime-edit-month-field,input.dmy-date::-webkit-datetime-edit-year-field,
    input.dmy-date::-webkit-datetime-edit-hour-field,input.dmy-date::-webkit-datetime-edit-minute-field,
    input.dmy-date::-webkit-datetime-edit-ampm-field{color:transparent!important;background:transparent!important}
    input.dmy-date:focus::-webkit-datetime-edit,input.dmy-date:focus::-webkit-datetime-edit *{color:transparent!important}
    @-moz-document url-prefix(){input.dmy-date{color:transparent!important}}
  `
  document.head.appendChild(style)

  // Programmatic updates (Vue v-model sets input.value) do not fire events:
  // repaint whenever a date input's value is assigned.
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
  if (descriptor?.set && descriptor.get) {
    Object.defineProperty(HTMLInputElement.prototype, 'value', {
      configurable: true,
      enumerable: descriptor.enumerable,
      get() { return descriptor.get!.call(this) },
      set(next) {
        descriptor.set!.call(this, next)
        if (DATE_TYPES.has((this as HTMLInputElement).type) || (this as HTMLInputElement).classList?.contains('dmy-date')) {
          queueMicrotask(() => paint(this as HTMLInputElement))
        }
      },
    })
  }

  const onUserChange = (event: Event) => {
    const target = event.target
    if (target instanceof HTMLInputElement && (DATE_TYPES.has(target.type) || target.classList.contains('dmy-date'))) paint(target)
  }
  document.addEventListener('input', onUserChange, true)
  document.addEventListener('change', onUserChange, true)

  // Mutations are batched once per frame, and the observer is paused while this
  // plugin edits the DOM itself, so its own changes can never re-trigger it.
  const options: MutationObserverInit = { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['type', 'disabled'] }
  const pendingNodes = new Set<Node>()
  let frame = 0
  const flush = () => {
    frame = 0
    const nodes = [...pendingNodes]
    pendingNodes.clear()
    observer.disconnect()
    try {
      for (const node of nodes) {
        if (!node.isConnected) continue
        if (node.nodeType === Node.TEXT_NODE) rewriteText(node as Text)
        else if (node instanceof HTMLInputElement) paint(node)
        else scan(node)
      }
    } finally {
      observer.takeRecords()
      observer.observe(document.body, options)
    }
  }
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData' || mutation.type === 'attributes') pendingNodes.add(mutation.target)
      else mutation.addedNodes.forEach((node) => pendingNodes.add(node))
    }
    if (pendingNodes.size && !frame) frame = requestAnimationFrame(flush)
  })
  const start = () => {
    scan(document.body)
    observer.observe(document.body, options)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true })
  else start()
})
