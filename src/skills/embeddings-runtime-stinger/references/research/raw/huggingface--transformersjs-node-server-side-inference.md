# Server-side Inference in Node.js - Transformers.js (Hugging Face)
- URL: https://huggingface.co/docs/transformers.js/main/en/tutorials/node
- Fetched: 2026-08-14
- Source type: official-docs
- Component: embeddings-runtime (transformers.js local/self-hosted runtime in Node.js: setup, model caching, local-model config)

## Summary

Official Hugging Face tutorial for running `@huggingface/transformers` (transformers.js) server-side in Node.js, the same library family the existing local-daemon (nomic-embed-text-v1.5) implementation in this stinger already uses. Confirms the runtime shape, model caching behavior, and the config knobs for fully offline / local-only operation.

## Setup

Requirements: Node.js 18+, npm 9+.

```bash
npm init -y
npm i @huggingface/transformers
```

Transformers.js runs in both ESM (`"type": "module"` in package.json, `import`/`export`) and CommonJS (`require()`, dynamic `import()` since the library itself is ESM-only) Node projects. You can run inference entirely in JavaScript without shelling out to a separate Python process, which is the same rationale the existing daemon architecture in this repo relies on.

## Pipeline pattern (singleton, lazy load)

The recommended pattern wraps `pipeline()` in a singleton class so the model loads once and is reused across requests, structurally identical to this stinger's existing warm-daemon principle:

```javascript
import { pipeline, env } from "@huggingface/transformers";

class MyClassificationPipeline {
  static task = "text-classification";
  static model = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}
```

For an embedding pipeline the task is `"feature-extraction"` instead of `"text-classification"`, with the model swapped for an embedding model (e.g. `Xenova/all-MiniLM-L6-v2` or `nomic-ai/nomic-embed-text-v1.5`), and the extractor called with `{ pooling: "mean", normalize: true }`.

## Model caching and fully-local operation

Three `env` settings control where model weights come from and whether the library is allowed to reach the network at all:

- `env.cacheDir` - first run downloads and caches model files on the local filesystem (defaults to `./node_modules/@huggingface/transformers/.cache/`); subsequent runs reuse the cache with no re-download. Set this to control the cache location (this stinger's existing shared install path, `~/.hivemind/embed-deps/`, is exactly this kind of override).
- `env.localModelPath` - point at a directory of pre-downloaded/pre-converted local model files instead of the Hugging Face Hub.
- `env.allowRemoteModels = false` - disables loading models from the Hugging Face Hub entirely, forcing fully offline operation once a model is cached locally. This is the mechanism to guarantee "nothing leaves the machine, ever" for a self-hosted embedding path, not just at inference time but at model-fetch time too.

## Custom / converted models

To run a model transformers.js doesn't ship a pre-converted ONNX version of, Hugging Face recommends using `Optimum` to convert a PyTorch model to ONNX in a single command; transformers.js consumes ONNX via `onnxruntime-node` (Node) or `onnxruntime-web` (browser/WASM) automatically depending on environment.
