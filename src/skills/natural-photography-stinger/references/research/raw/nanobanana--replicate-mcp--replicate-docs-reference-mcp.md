# Replicate's MCP server — official docs
- URL: https://replicate.com/docs/reference/mcp
- Fetched: 2026-08-17
- Source type: official-docs

An **official** Replicate MCP server exists (announced 2025-08-10, https://replicate.com/blog/remote-mcp-server).

## Remote (recommended)
- Hosted at **`mcp.replicate.com`**.
- Auth: web-based OAuth flow (Cloudflare OAuth Provider Framework for Workers); you supply a
  Replicate API key that the server uses on your behalf. Tokens stored in Cloudflare KV,
  kept separate from the AI tool.

## Local (npm package)
`npx -y replicate-mcp`, with `REPLICATE_API_TOKEN` in env. Requires a recent Node.js.

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "replicate": {
      "command": "npx",
      "args": ["-y", "replicate-mcp"],
      "env": { "REPLICATE_API_TOKEN": "your-token-here" }
    }
  }
}
```

### Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "replicate": {
      "command": "npx",
      "args": ["-y", "replicate-mcp"],
      "env": { "REPLICATE_API_TOKEN": "your-token-here" }
    }
  }
}
```

### VS Code / GitHub Copilot (`.vscode/mcp.json`)
```json
{
  "servers": {
    "replicate": {
      "command": "npx",
      "args": ["-y", "replicate-mcp"],
      "env": { "REPLICATE_API_TOKEN": "your-token-here" }
    }
  }
}
```

## Tools exposed (mirror Replicate's HTTP API)
- `models.search` — model discovery
- `models.list` — model comparison
- `models.get` — fetch metadata (this is how you pull a model's live input schema)
- `predictions.create` — run models
- `predictions.get` — retrieve predictions

Responses can be filtered with a WebAssembly `jq` implementation to keep JSON small.

## Limitations noted
- Claude Desktop support is local-only (not the web app).
- "Code mode" is experimental and requires Deno; remote cloud sandboxing for code mode is under development.

## Community alternatives (not official)
- `deepfates/mcp-replicate` (github.com/deepfates/mcp-replicate)
- `gerred/mcp-server-replicate`
