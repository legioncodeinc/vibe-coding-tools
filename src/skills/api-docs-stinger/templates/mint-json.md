# Mintlify mint.json Template

Place at the root of your Mintlify docs repo as `mint.json`.

```json
{
  "$schema": "https://mintlify.com/schema.json",
  "name": "My API Docs",
  "logo": {
    "dark": "/logo/dark.svg",
    "light": "/logo/light.svg"
  },
  "favicon": "/favicon.ico",
  "colors": {
    "primary": "#0066cc",
    "light": "#3399ff",
    "dark": "#004499",
    "background": {
      "dark": "#0d1117"
    },
    "anchors": {
      "from": "#0066cc",
      "to": "#3399ff"
    }
  },
  "topbarLinks": [
    {
      "name": "Support",
      "url": "mailto:support@example.com"
    }
  ],
  "topbarCtaButton": {
    "name": "Dashboard",
    "url": "https://app.example.com"
  },
  "tabs": [
    {
      "name": "API Reference",
      "url": "api-reference"
    }
  ],
  "anchors": [
    {
      "name": "GitHub",
      "icon": "github",
      "url": "https://github.com/org/repo"
    }
  ],
  "navigation": [
    {
      "group": "Getting Started",
      "pages": ["introduction", "quickstart", "authentication"]
    },
    {
      "group": "API Reference",
      "pages": ["api-reference/overview"]
    }
  ],
  "openapi": "/openapi.yaml",
  "footerSocials": {
    "github": "https://github.com/org/repo"
  }
}
```

## Notes

- `openapi` field: point to your OpenAPI spec. Mintlify auto-generates reference pages from it.
- Navigation groups: customize the sidebar structure. The `api-reference` tab is auto-populated from the spec.
- Colors: replace all hex values with your brand colors.
- Mintlify requires a paid plan ($150+/mo) for custom domains and unlimited pages.
