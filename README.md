# Getting started
## Prod mode
```shell
npm i
npm run build
npm start
```

## Dev mode
```shell
npm i
npm run dev
```

# Add shadcn component
```shell
npx shadcn@latest add button
```
See more: https://ui.shadcn.com/docs/components/button

# Troubleshoot
### 1. React.forwardRef is not a function
- open `node_modules/@radix-ui/react-slot/dist/index.mjs`
- replace `import * as React from "react"` with `import React from "react"`
- run `npx patch-package @radix-ui/react-slot`
- add `npx patch-package` as a postinstall script in `package.json`
