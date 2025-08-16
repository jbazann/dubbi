import type { Runtime } from "@astrojs/cloudflare"

declare global {
  interface Window {
    htmx: typeof import("htmx.org").default
  }

  namespace App {
    interface Locals extends Runtime<Cloudflare.Env> {
    }
  }
}