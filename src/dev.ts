import RefreshRuntime from 'react-refresh/runtime'
// @ts-expect-error no type def yet
import hotmods from 'pear-hotmods'

RefreshRuntime.injectIntoGlobalHook(window)
// @ts-expect-error no type def yet
window.$RefreshReg$ = RefreshRuntime.register
// @ts-expect-error no type def yet
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform

const paths = ['/build/src']
const debounceRefresh = debounce(RefreshRuntime.performReactRefresh)
hotmods({ paths }, (reloads: unknown[]) => {
  if (reloads.length) {
    debounceRefresh()
  }
})

function debounce (fn: (...args: unknown[]) => void, delay = 100) {
  let timer: NodeJS.Timeout | undefined
  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
