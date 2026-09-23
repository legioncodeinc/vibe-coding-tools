# Docker Bake (HCL) — shared local + CI build definitions.
# Source: guides/10-local-ci-parity.md.
# Local: depot bake app   (or `docker buildx bake app`)
# CI:    depot/bake-action with files: docker-bake.hcl

variable "TAG" {
  default = "dev"
}

variable "REGISTRY" {
  default = "ghcr.io/me"
}

variable "NODE_VERSION" {
  default = "20.18.1"
}

variable "PLATFORMS" {
  default = "linux/amd64"
}

# Default group — `bake` with no args runs this.
group "default" {
  targets = ["app"]
}

# All targets — for full builds.
group "all" {
  targets = ["app", "worker"]
}

# CI override — multi-arch.
group "ci" {
  targets = ["app-multiarch", "worker-multiarch"]
}

# Base target — common settings.
target "_base" {
  context    = "."
  dockerfile = "Dockerfile"
  args = {
    NODE_VERSION = NODE_VERSION
  }
}

# App: production runtime.
target "app" {
  inherits = ["_base"]
  target   = "runtime"
  tags     = ["${REGISTRY}/app:${TAG}"]
  platforms = ["linux/amd64"]
}

target "app-multiarch" {
  inherits  = ["app"]
  platforms = ["linux/amd64", "linux/arm64"]
  tags = [
    "${REGISTRY}/app:${TAG}",
    "${REGISTRY}/app:latest",
  ]
}

# Worker: same Dockerfile, different stage.
target "worker" {
  inherits = ["_base"]
  target   = "worker-runtime"
  tags     = ["${REGISTRY}/worker:${TAG}"]
  platforms = ["linux/amd64"]
}

target "worker-multiarch" {
  inherits  = ["worker"]
  platforms = ["linux/amd64", "linux/arm64"]
}

# Dev — for local Compose. Targets the `dev` stage of the Dockerfile.
target "dev" {
  inherits = ["_base"]
  target   = "dev"
  tags     = ["${REGISTRY}/app:dev"]
  output   = ["type=docker"]
}
