import RefreshRuntime from 'react-refresh/runtime'
import hotmods from 'pear-hotmods'

RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = RefreshRuntime.register
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform

const paths = ['/build/src']
const debounceRefresh = debounce(RefreshRuntime.performReactRefresh)
hotmods({ paths }, (reloads) => {
  if (reloads.length) {
    debounceRefresh()
  }
})

function debounce (fn, delay = 100) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
