/**
 * Boilerplate for a typed unified remark or rehype plugin.
 *
 * Usage: copy this file, rename, implement the transformer body,
 * and add to the .use() chain in your pipeline.
 *
 * Remark plugin: import `Root` from 'mdast'; operates on mdast tree.
 * Rehype plugin: import `Root` from 'hast'; operates on hast tree.
 */

import type { Plugin, Transformer } from 'unified'
import type { Root } from 'mdast'        // Change to 'hast' for rehype plugins
import { visit } from 'unist-util-visit'
import { SKIP } from 'unist-util-visit'  // Import CONTINUE, EXIT, SKIP as needed

// ─── Options interface ────────────────────────────────────────────────────────

export interface MyPluginOptions {
  /** Example option with a default. */
  prefix?: string
}

// ─── Plugin function ──────────────────────────────────────────────────────────

/**
 * myPlugin — describe what this plugin transforms.
 *
 * @example
 * unified()
 *   .use(remarkParse)
 *   .use(myPlugin, { prefix: 'NOTE' })
 *   .use(remarkStringify)
 */
const myPlugin: Plugin<[MyPluginOptions?], Root> = (options = {}) => {
  const { prefix = 'default' } = options

  const transformer: Transformer<Root> = (tree, file) => {
    // Visit every node of a specific type.
    // Replace 'paragraph' with the node type you want to transform.
    visit(tree, 'paragraph', (node, index, parent) => {
      // ── inspect ──────────────────────────────────────────────
      // node: the current mdast/hast node
      // index: position of node in parent.children (may be null)
      // parent: the parent node (may be null at root)

      // ── mutate in place ──────────────────────────────────────
      // Example: mutate a text node's value
      // const firstChild = node.children[0]
      // if (firstChild?.type === 'text') {
      //   firstChild.value = `${prefix}: ${firstChild.value}`
      // }

      // ── replace node ─────────────────────────────────────────
      // If replacing the node, splice and return [SKIP, index]:
      // if (parent && index !== null) {
      //   const replacement = { type: 'paragraph', children: [...] }
      //   parent.children.splice(index, 1, replacement as typeof node)
      //   return [SKIP, index]
      // }

      // ── set hast properties (for remark→rehype bridge) ───────
      // Bridge values are picked up by remarkRehype and become hast attributes:
      // const data = node.data ?? (node.data = {})
      // data.hName = 'div'
      // data.hProperties = { className: [`my-class-${prefix}`] }

      // ── log for debugging (remove before shipping) ───────────
      // file.message(`Processing node at index ${index}`, node.position)
    })
  }

  return transformer
}

export default myPlugin

// ─── Async transformer (if you need async work inside the plugin) ─────────────

// const myAsyncPlugin: Plugin<[MyPluginOptions?], Root> = (options = {}) => {
//   return async (tree, file) => {
//     // async work here
//     await someAsyncOperation()
//   }
// }
