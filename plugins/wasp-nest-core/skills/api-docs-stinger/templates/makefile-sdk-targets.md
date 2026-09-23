# Makefile SDK Targets Template

Copy this into your project's `Makefile`. Adjust `SPEC`, `SDK_TS_OUT`, `SDK_PY_OUT`, `SDK_GO_OUT` for your layout.

```makefile
# Configuration — adjust these
SPEC            := openapi.yaml
SDK_TS_OUT      := sdk/typescript
SDK_PY_OUT      := sdk/python
SDK_GO_OUT      := sdk/go
PACKAGE_TS      := my-api-client
PACKAGE_PY      := my_api_client
PACKAGE_GO      := myapiclient

.PHONY: sdk sdk-ts sdk-py sdk-go sdk-validate docs docs-preview

# Generate all SDKs
sdk: sdk-validate sdk-ts sdk-py sdk-go
	@echo "✅ All SDKs generated."

# Validate spec before generating
sdk-validate:
	npx @redocly/cli lint $(SPEC)

# TypeScript SDK (openapi-generator-cli)
sdk-ts:
	npx @openapitools/openapi-generator-cli generate \
		-i $(SPEC) \
		-g typescript-axios \
		-o $(SDK_TS_OUT) \
		--additional-properties=supportsES6=true,npmName=$(PACKAGE_TS)
	@echo "✅ TypeScript SDK at $(SDK_TS_OUT)"

# Python SDK (openapi-generator-cli)
sdk-py:
	npx @openapitools/openapi-generator-cli generate \
		-i $(SPEC) \
		-g python \
		-o $(SDK_PY_OUT) \
		--additional-properties=packageName=$(PACKAGE_PY)
	@echo "✅ Python SDK at $(SDK_PY_OUT)"

# Go SDK (openapi-generator-cli)
sdk-go:
	npx @openapitools/openapi-generator-cli generate \
		-i $(SPEC) \
		-g go \
		-o $(SDK_GO_OUT) \
		--additional-properties=packageName=$(PACKAGE_GO),structPrefix=true
	@echo "✅ Go SDK at $(SDK_GO_OUT)"

# --- Fern alternative (comment out the above sdk-ts / sdk-py if using Fern) ---
# sdk-fern:
# 	fern generate --local
# 	@echo "✅ Fern SDKs generated"

# Build docs (Redoc static bundle)
docs:
	npx @redocly/cli build-docs $(SPEC) --output docs/index.html
	@echo "✅ Docs built at docs/index.html"

# Preview docs locally
docs-preview: docs
	cd docs && python3 -m http.server 8080
```
