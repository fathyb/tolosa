# tolosa

A fast, functional, reactive and declarative web framework.

> Work in progress, see [Current status](#Current-status)

# In a nutshell

- 6KB, no dependencies
- JSX with TypeScript and Flow support
- Ultra-fast. Tolosa ranks top on most benchmarks
- Simple and clean syntax. No class/object to implement. Just JSX
- Lifecycle events
- No need to import `h`. Create a hello world app in one line :
  ```js
  document.body.appendChild(<h2>hello world</h2>)
  ```
- No virtual DOM. Updates are incremental, batched and non-redudant.
- No state and predictible data-flow. Streams and/or monads are used instead, with support modules for :
  - RxJS
  - Most.js
  - Make your own
- And by design : two-way data binding, native lazy-loading and easy third party library integration : 
  ```jsx
  const [foo, bar] = [new Emitter(), new Emitter()]
  <h2>
    {/* Lazy-loading using ES6 import */}
    {import('./a-lazy-component')}
    {/* Two-way data-binding, implicit or explicit */}
    <input bind={foo}/>
    <input value={bar} onInput={bar}/>
    <span>foo : {foo}, bar : {bar}</span>
    {
      /* implement any external library, like jQuery */
      $('<span>hello from jQuery</span>').get(0)
    }
  </h2>
  ```

Tolosa is heavily inspired by multiple frameworks :
- Cycle.js for the functional and reactive principles
- Surplus.js and incremental-dom for the DOM part
- React for JSX

# Installation

Tolosa is a set of packages published individually to npm.
Babel or TypeScript is needed to compile your code. ([Why?](#))

- Install the core : `yarn add @tolosa/core`
- Install the plugin for your compiler :
  - Babel : `yarn add @tolosa/transform-babel --dev`
  - TypeScript : `yarn add @tolosa/transform-typescript --dev`
- Install the support for your stream library (optional) : 
  - RxJS : `yarn add @tolosa/rxjs`
  - Most.js : `yarn add @tolosa/most`

# Usage

## Update the UI

You can use multiple approach to update your UI.

- Stream :
  - Really fast, creates a direct connection between the source and the DOM node
  - Makes the code more isolated, easier to test and scale
- Imperative :
  - Update and compare the DOM nodes in place each call
  - May make the code simpler

### Imperative oriented

JSX elements are static in Tolosa. For example in the code below this is `true` : `render(0) === render(1)`.

Each time `render` is called the DOM is compared in place and updates are batched. It can be compared to what `incremental-dom` is doing.

```jsx
const initial = 0
const render = counter =>
    <div>
        <button onClick={() => render(counter + 1)}>Increment</button>
        <button onClick={() => render(counter - 1)}>Decrement</button>
        <h2>Counter : {counter}</h2>
    </div>

document.body.appendChild(render(initial))
```

### Stream oriented

```jsx
// Emitter is a RxJS Observable that can emit events
import {Emitter} from '@tolosa/rxjs'
import {merge} from 'rxjs'

const increment = new Emitter()
const decrement = new Emitter()
const initial = 0

// create the counter stream
const counter =
    merge(
        // for each click on increment emit +1
        increment.constant(+1),
        // for each click on decrement emit -1
        decrement.constant(-1)
    )
        // add the increment value to the counter
        // with an initial value of 0
        // .scan behaves like Array.reduce
        .scan((acc, next) => acc + next, initial)

document.body.appendChild(
    <div>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <h2>Counter : {counter}</h2>
    </div>
)
```

### Reducer using streams

```jsx
// Emitter is a RxJS Observable that can emit events
import {Emitter} from '@tolosa/rxjs'
import {merge} from 'rxjs'

function reducer(state = 0, action) {
    switch(action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

const increment = new Emitter()
const decrement = new Emitter()

// create the counter stream
const counter = merge(
    increment.constant({type: 'INCREMENT'}),
    decrement.constant({type: 'DECREMENT'})
).scan(reducer, reducer(0, {}))

document.body.appendChild(
    <div>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <h2>Counter : {counter}</h2>
    </div>
)
```

See `examples/`.

Load a remote resource :

```jsx
import {fromPromise} from 'most'

document.body.appendChild(
    <div>
        {
            fromPromise(
                fetch('/my-service').then(res => res.json())
            ).startWith('Loading...')
        }
    </div>
)
```

# Current status

- [x] Array support with `key`
- [x] Stream support :
  - [x] emit
  - [x] observe
  - [x] `style` observable property
- [ ] Babel/Flow support
- [ ] TypeScript support
  - [x] General typings
  - [x] Typed `Observable`/`Emitter` plugins
  - [ ] JSX typings (currently set to any)
- [ ] Fragments
  - [x] Zero or one child
  - [ ] More than one child
- [ ] Stream libaries support
  - [x] RxJS
  - [x] Most.js
  - [ ] xstream
  - [ ] zen-observable
- [ ] Rewrite the list comparison algorithm

## How it internaly works

### Compilation

```jsx
const Component = () =>
    <scope>
        <h2>It's a component!</h2>
    </scope>

let times = 0
const Element = () =>
	<h2>this element has been rendered {++times}</h2>

// Component() is not reused
assert(Component() !== Component())
assert(Component() !== Component())

// Element() is reused
assert(Element() == Element())

const element = <div>
  <h2 style={{color: 'red'}}>Something red</h2>
</div>
```

Gets compiled to (prettified) :

```js
import { h } from "@tolosa/core";

const Component = () => {
    var bag_1 = {};

    return h(
    //  tag,  bag,   id,  key,  props,
        "h2", bag_1, "2", null, 0,
    //  childs
        ["It's a component!"]
    );
}

assert(Component() !== Component());

var bag_0 = {};

const element = h(
    // tag,   bag,   id,  key,  props
       "div", bag_0, "1", null, 0,
    // childs
    [
    //    tag,  bag,   id,  key,  props,          childs
        h("h2", bag_0, "0", null, {color: "red"}, ["Something red"])
    ]
);
```

The bag is used to decide if we should reuse or create an element. In this case `bag_0` will be populated like this :
```jsx
bag_0 = {
    '0': <#HTMLHeadingElement/>,
    '1': <#HTMLDivElement/>,
}
```

# Developement

Only `yarn` is supported.

## Install deps

`yarn`

## Build

- All : `yarn build`
- Only a package, example with `transform/typescript` :
  - `yarn build transform/typescript`
  - or `yarn build packages/transform/typescript`

## Test

Source files are used, no building is needed.

`yarn test`

## Lint

`yarn lint`
