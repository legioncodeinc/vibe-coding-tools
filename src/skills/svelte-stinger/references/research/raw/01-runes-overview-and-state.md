# What are runes? / $state
- URL: https://svelte.dev/docs/svelte/what-are-runes ; https://svelte.dev/docs/svelte/$state
- Fetched: 2026-08-14
- Source type: official docs
- Component: runes

## What are runes? (https://svelte.dev/docs/svelte/what-are-runes)

rune /ru:n/ noun

A letter or mark used as a mystical or magic symbol.

Runes are symbols that you use in `.svelte` and `.svelte.js`/`.svelte.ts` files to control the Svelte compiler. If you think of Svelte as a language, runes are part of the syntax, they are keywords.

Runes have a `$` prefix and look like functions:

```js
function $state<"hello">(initial: "hello"): "hello" (+1 overload)
```

Declares reactive state.

Example:

```js
let count = $state(0);
```

They differ from normal JavaScript functions in important ways, however:

- You don't need to import them, they are part of the language
- They're not values, you can't assign them to a variable or pass them as arguments to a function
- Just like JavaScript keywords, they are only valid in certain positions (the compiler will help you if you put them in the wrong place)

Legacy mode: Runes didn't exist prior to Svelte 5.

## $state (https://svelte.dev/docs/svelte/$state)

The `$state` rune allows you to create reactive state, which means that your UI reacts when it changes.

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

Unlike other frameworks you may have encountered, there is no API for interacting with state, `count` is just a number, rather than an object or a function, and you can update it like you would update any other variable.

### Deep state

If `$state` is used with an array or a simple object, the result is a deeply reactive state proxy. Proxies allow Svelte to run code when you read or write properties, including via methods like `array.push(...)`, triggering granular updates.

State is proxified recursively until Svelte finds something other than an array or simple object (like a class or an object created with `Object.create`).

```ts
let todos: { done: boolean; text: string }[] = $state([
  { done: false, text: 'add more todos' }
]);
```

Modifying an individual todo's property will trigger updates to anything in your UI that depends on that specific property:

```js
todos[0].done = !todos[0].done;
```

If you push a new object to the array, it will also be proxified:

```js
todos.push({ done: false, text: 'eat lunch' });
```

When you update properties of proxies, the original object is not mutated. If you need to use your own proxy handlers in a state proxy, you should wrap the object after wrapping it in `$state`.

Note that if you destructure a reactive value, the references are not reactive, as in normal JavaScript, they are evaluated at the point of destructuring:

```js
let { done } = todos[0]; // this will not affect the value of `done`
todos[0].done = !todos[0].done;
```

### Classes

Class instances are not proxied. Instead, you can use `$state` in class fields (whether public or private), or as the first assignment to a property immediately inside the `constructor`:

```js
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}
```

The compiler transforms `done` and `text` into `get`/`set` methods on the class prototype referencing private fields. This means the properties are not enumerable.

When calling methods in JavaScript, the value of `this` matters. This won't work, because `this` inside the `reset` method will be the `<button>` rather than the `Todo`:

```svelte
<button onclick={todo.reset}>
	reset
</button>
```

You can either use an inline function...

```svelte
<button onclick={() => todo.reset()}>
	reset
</button>
```

...or use an arrow function in the class definition:

```js
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset = () => {
		this.text = '';
		this.done = false;
	}
}
```

### Built-in classes

Svelte provides reactive implementations of built-in classes like `Set`, `Map`, `Date` and `URL` that can be imported from `svelte/reactivity`.

## $state.raw

In cases where you don't want objects and arrays to be deeply reactive you can use `$state.raw`.

State declared with `$state.raw` cannot be mutated; it can only be reassigned. In other words, rather than assigning to a property of an object, or using an array method like `push`, replace the object or array altogether if you'd like to update it:

```svelte
<script>
  let items = $state.raw([0]);

  const addItem = () => {
	items = [...items, items.length];
  };
</script>

<button onclick={addItem}>
  {items.join(', ')}
</button>
```

Also:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });

person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // this will work, because we're reassigning the whole object
```

This can improve performance with large arrays and objects that you weren't planning to mutate anyway, since it avoids the cost of making them reactive. Note that raw state can contain reactive state (for example, a raw array of reactive objects).

As with `$state`, you can declare class fields using `$state.raw`.

## $state.snapshot

To take a static snapshot of a deeply reactive `$state` proxy, use `$state.snapshot`:

```svelte
<script>
	let counter = $state({ count: 0 });

	function onclick() {
		// Will log `{ count: ... }` rather than `Proxy { ... }`
		console.log($state.snapshot(counter));
	}
</script>
```

This is handy when you want to pass some state to an external library or API that doesn't expect a proxy, such as `structuredClone`.

If a value has a `toJSON` method, the snapshot will clone the value returned from `toJSON` instead of the original object.

## $state.eager

When state changes, it may not be reflected in the UI immediately if it is used by an `await` expression, because updates are synchronized.

In some cases, you may want to update the UI as soon as the state changes. For example, you might want to update a navigation bar when the user clicks on a link, so that they get visual feedback while waiting for the new page to load. To do this, use `$state.eager(value)`:

```svelte
<nav>
	<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
	<a href="/about" aria-current={$state.eager(pathname) === '/about' ? 'page' : null}>about</a>
</nav>
```

Use this feature sparingly, and only to provide feedback in response to user action, in general, allowing Svelte to coordinate updates will provide a better user experience.

### Passing state into functions

JavaScript is a pass-by-value language, when you call a function, the arguments are the values rather than the variables. If a function wants access to the *current* value of a variable rather than the value at the time the function was called, and wants to be able to update it, it needs to use functions (getters/setters) rather than plain values, because a plain number or string will not update reactively when passed into a function.
