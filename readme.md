# Mittss

> forked from [mitt](https://github.com/developit/mitt)

![MIT](https://img.shields.io/npm/l/mittss)
![NPM Version](https://img.shields.io/npm/v/mittss)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/mittss)
![NPM Unpacked Size (with version)](https://img.shields.io/npm/unpacked-size/mittss/latest)

## What is Mittss?

`Mittss` is an lightweight and simple event emitter / pubsub, rewrite the `mitt`
using a class.

- **Lightweight**: weighs less than 300 bytes gzipped
- **Useful**: a wildcard `"*"` event type listens to all events
- **Familiar**: same names & ideas as
  [Node's EventEmitter](https://nodejs.org/docs/latest/api/events.html#class-eventemitter)
- **Extendable**: easily extendable with inheritance.
- **Zero Dependencies**: Works out of the box without additional libraries.

## Installation

```bash
npm install mittss
```

or

```bash
pnpm add mittss
```

## Usage

### Basic Example

```javascript
import { Emitter } from 'mittss'

// Create a Emitter instance
const emitter = new Emitter()

// listen to an event
emitter.on('foo', e => console.log('foo', e))

// listen to all events
emitter.on('*', (type, e) => console.log(type, e))

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.all.clear()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo) // listen
emitter.off('foo', onFoo) // unlisten
emitter.once('foo', onFoo) // listen once
```

### Typescript

Set "strict": true in your tsconfig.json to get improved type inference for mitt
instance methods.

```typescript
import { Emitter } from 'mittss'

type Events = {
  foo: string
  bar?: number
}

const emitter = new Emitter<Events>() // inferred as Emitter<Events>

emitter.on('foo', e => {}) // 'e' has inferred type 'string'

emitter.emit('foo', 42) // Error: Argument of type 'number' is not assignable to parameter of type 'string'. (2345)
```

### Extending Emitter

Since `Emitter` is a class, you can easily extend it to add custom
functionality:

```javascript
class MyEmitter extends Emitter {
  constructor() {
    super()
  }

  greet(name) {
    this.emit('greet', name)
  }
}

const myEmitter = new MyEmitter()
myEmitter.on('greet', name => {
  console.log(`Hello, ${name}!`)
})

myEmitter.greet('Bob') // Output: Hello, Bob!
```

### Functional Emitter

```typescript
const mitt = <Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>,
) => {
  return new Emitter<Events>(all)
}

const emitter = mitt()
```

## Differences from mitt

`Emitter` is forked from [mitt](https://github.com/developit/mitt), with the
following key differences:

- Implemented using `class`, supporting inheritance and extension.
- Provides a `once` method for one-time event listeners.

## Acknowledgments

Thanks to [mitt](https://github.com/developit/mitt) again for the inspiration.

## License

MIT © [nnecec](https://github.com/nnecec)
