# Source: effect.website v4 docs - getting-started/installation
- URL: https://effect.website/docs/v4/getting-started/installation
- Fetched: 2026-10-07
- Source type: official documentation (Effect v4, effect.website)

---

# Installation

Requirements:

- TypeScript 5.9 or newer. TypeScript 7 is recommended for the best performance and compatibility with [Effect's TypeScript tooling](/docs/v4/getting-started/devtools/).
- Node.js 22.18 or newer, Deno, and Bun are supported.

## Manual Installation

### JavaScript runtimes

Follow these steps to create a new Effect project for [Node.js](https://nodejs.org/), [Bun](https://bun.sh/), or [Deno](https://deno.com/):

1. Create a project directory and navigate into it:

   ```sh
   mkdir hello-effect
   cd hello-effect
   ```

2. Initialize a TypeScript project:

   **npm**

   ```sh
   npm init -y
   npm install --save-dev typescript
   ```

   **pnpm**

   ```sh
   pnpm init
   pnpm add --save-dev typescript
   ```

   **Yarn**

   ```sh
   yarn init -y
   yarn add --dev typescript
   ```

   **Bun**

   ```sh
   bun init
   ```

   **Deno**

   ```sh
   deno init
   ```

   This creates a `package.json` file with an initial setup for your TypeScript project. For Bun, this also generates a `tsconfig.json` file. For Deno, this generates a `deno.json` file.

   Make sure the `package.json` file contains the `"type": "module"` field, so that Node.js treats your source files as ES modules (`bun init` adds this automatically):

   ```json
   {
     "type": "module"
   }
   ```

3. Initialize TypeScript:

   **npm**

   ```sh
   npx tsc --init
   ```

   **pnpm**

   ```sh
   pnpm tsc --init
   ```

   **Yarn**

   ```sh
   yarn tsc --init
   ```

   **Bun**

   `bun init` has already generated a `tsconfig.json` file.

   **Deno**

   Deno runs TypeScript out of the box, and `deno init` has already generated a `deno.json` file with `strict` mode enabled by default. No further configuration is needed.

   When running this command, it will generate a `tsconfig.json` file that contains configuration options for TypeScript. One of the most important options to consider is the `strict` flag.

   Make sure to open the `tsconfig.json` file and verify that the value of the `strict` option is set to `true`.

   ```json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

4. Install the necessary package as dependency:

   **npm**

   ```sh
   npm install effect
   ```

   **pnpm**

   ```sh
   pnpm add effect
   ```

   **Yarn**

   ```sh
   yarn add effect
   ```

   **Bun**

   ```sh
   bun add effect
   ```

   **Deno**

   ```sh
   deno add npm:effect
   ```

   This package will provide the foundational functionality for your Effect project.

Let's write and run a simple program to ensure that everything is set up correctly.

In your terminal, execute the following commands:

```sh
mkdir src
touch src/index.ts
```

Open the `src/index.ts` file and add the following code:

```ts
import { Effect, Console } from "effect"

const program = Console.log("Hello, World!")

const result = Effect.runSync(program) // => undefined
```

Run the `src/index.ts` file. Node.js 22.18 or newer, Bun, and Deno can run TypeScript files directly, so no additional tooling is needed:

**npm**

```sh
node src/index.ts
```

**pnpm**

```sh
node src/index.ts
```

**Yarn**

```sh
node src/index.ts
```

**Bun**

```sh
bun src/index.ts
```

**Deno**

```sh
deno run src/index.ts
```

If you are using an older version of Node.js, run the file with [tsx](https://github.com/privatenumber/tsx) instead: `npx tsx src/index.ts`.

You should see the message `"Hello, World!"` printed. This confirms that the program is working correctly.

### Vite + React

Follow these steps to create a new Effect project for [Vite](https://vitejs.dev/guide/) + [React](https://react.dev/):

1. Scaffold your Vite project, open your terminal and run the following command:

   **npm**

   ```sh
   # npm 6.x
   npm create vite@latest hello-effect --template react-ts
   # npm 7+, extra double-dash is needed
   npm create vite@latest hello-effect -- --template react-ts
   ```

   **pnpm**

   ```sh
   pnpm create vite@latest hello-effect -- --template react-ts
   ```

   **Yarn**

   ```sh
   yarn create vite@latest hello-effect -- --template react-ts
   ```

   **Bun**

   ```sh
   bun create vite@latest hello-effect -- --template react-ts
   ```

   **Deno**

   ```sh
   deno init --npm vite@latest hello-effect -- --template react-ts
   ```

   This command will create a new Vite project with React and TypeScript template.

2. Navigate into the newly created project directory and install the required packages:

   **npm**

   ```sh
   cd hello-effect
   npm install
   ```

   **pnpm**

   ```sh
   cd hello-effect
   pnpm install
   ```

   **Yarn**

   ```sh
   cd hello-effect
   yarn install
   ```

   **Bun**

   ```sh
   cd hello-effect
   bun install
   ```

   **Deno**

   ```sh
   cd hello-effect
   deno install
   ```

   Once the packages are installed, open the `tsconfig.json` file and ensure that the value of the `strict` option is set to true.

   ```json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

3. Install the necessary package as dependency:

   **npm**

   ```sh
   npm install effect
   ```

   **pnpm**

   ```sh
   pnpm add effect
   ```

   **Yarn**

   ```sh
   yarn add effect
   ```

   **Bun**

   ```sh
   bun add effect
   ```

   **Deno**

   ```sh
   deno add npm:effect
   ```

   This package will provide the foundational functionality for your Effect project.

Now, let's write and run a simple program to ensure that everything is set up correctly.

Open the `src/App.tsx` file and replace its content with the following code:

```diff
+import { useState, useMemo, useCallback } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
+import { Effect } from "effect"

function App() {
  const [count, setCount] = useState(0)

+  const task = useMemo(
+    () => Effect.sync(() => setCount((current) => current + 1)),
+    [setCount]
+  )
+
+  const increment = useCallback(() => Effect.runSync(task), [task])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
+        <button onClick={increment}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

After making these changes, start the development server by running the following command:

**npm**

```sh
npm run dev
```

**pnpm**

```sh
pnpm run dev
```

**Yarn**

```sh
yarn run dev
```

**Bun**

```sh
bun run dev
```

**Deno**

```sh
deno run dev
```

Then, press **o** to open the application in your browser.

When you click the button, you should see the counter increment. This confirms that the program is working correctly.
