/** @typedef {import('pear-interface')} */

if (process.env.RUN_ENV === 'dev') {
  import('./dev').then(() => import('./root'))
} else {
  import('./root')
}
