/// <reference types="vite/client" />

declare module '*.mdx' {
  let MDXComponent: (props: unknown) => JSX.Element
  export default MDXComponent
}

interface Window {
  gtag: (command: string, action: string, params?: Record<string, unknown>) => void
}
