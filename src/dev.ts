import RefreshRuntime from 'react-refresh/runtime'
// @ts-ignore
import hotmods from 'pear-hotmods'

RefreshRuntime.injectIntoGlobalHook(window)
// @ts-ignore
window.$RefreshReg$ = RefreshRuntime.register
// @ts-ignore
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform

const paths = ['/build/src']
const debounceRefresh = debounce(RefreshRuntime.performReactRefresh)
hotmods({ paths }, (reloads: any[]) => {
  if (reloads.length) {
    debounceRefresh()
  }
})

function debounce (fn: (...args: any[]) => void, delay = 100) {
  let timer: NodeJS.Timeout | undefined
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
