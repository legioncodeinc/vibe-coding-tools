// Scalar configuration template
// Usage: import in your app entry point or embed in HTML
// Reference: https://github.com/scalar/scalar

export const scalarConfig = {
  // Point to your OpenAPI spec
  url: '/openapi.yaml',
  // or use inline content:
  // content: openApiJson,

  // Visual configuration
  theme: 'default' as const,        // 'default' | 'alternate' | 'moon' | 'purple' | 'solarized' | 'none'
  layout: 'modern' as const,        // 'modern' | 'classic'
  darkMode: true,

  // Branding
  // favicon: '/favicon.ico',
  customCss: `
    .scalar-app {
      --scalar-color-1: #0066cc;   /* Replace with brand color */
    }
  `,

  // Navigation
  hideDownloadButton: false,
  hiddenClients: [],               // ['curl', 'node', 'python', ...] to hide specific code samples

  // Authentication defaults (pre-fill for interactive console)
  authentication: {
    preferredSecurityScheme: 'BearerAuth',
    // apiKey: { token: 'demo-key' },
    // http: { username: 'demo', password: 'demo' },
  },

  // Servers (override spec servers for Try-it-out)
  // servers: [{ url: 'https://api.myapp.com', description: 'Production' }],
}

// For CDN embed (HTML approach):
// <script id="api-reference" data-url="/openapi.yaml" data-configuration='{"theme":"default"}'></script>
// <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>

// For React integration:
// npm install @scalar/api-reference @scalar/react-renderer
// import { ApiReference } from '@scalar/react-renderer'
// <ApiReference configuration={scalarConfig} />
