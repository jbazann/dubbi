export {}

declare global {
  interface Window {
    htmx: typeof import("htmx.org").default
  }
}