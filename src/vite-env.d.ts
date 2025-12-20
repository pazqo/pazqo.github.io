/// <reference types="vite/client" />

declare module '*.mdx' {
  let MDXComponent: (props: unknown) => JSX.Element
  export default MDXComponent
}
