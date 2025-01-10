# Get started

> forked from [mitt](https://github.com/developit/mitt)

![MIT](https://img.shields.io/npm/l/mittss)
![NPM Version](https://img.shields.io/npm/v/mittss)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/mittss)
![NPM Unpacked Size (with version)](https://img.shields.io/npm/unpacked-size/mittss/latest)

## What is Mittss?

`Mittss` is an lightweight and simple event emitter / pubsub, rewrite the `mitt`
using a class.

- **Lightweight**: sizes less than 300 bytes gzipped
- **Useful**: a wildcard `"*"` event type listens to all events
- **Familiar**: same names & ideas as
  [Node's EventEmitter](https://nodejs.org/docs/latest/api/events.html#class-eventemitter)
- **Extendable**: easily extendable with inheritance.
- **Zero Dependencies**: works out of the box without additional dependencies.

## Installation

:::code-group

```sh [npm]
$ npm add -D mittss
```

```sh [pnpm]
$ pnpm add -D mittss
```

```sh [yarn]
$ yarn add -D mittss
```

```sh [yarn (pnp)]
$ yarn add -D mittss
```

```sh [bun]
$ bun add -D mittss
```

:::

## Differences from mitt

`Emitter` is forked from [mitt](https://github.com/developit/mitt), with the
following key differences:

- Implemented using `class`, supporting inheritance and extension.
- Provides `once` method for one-time event listeners.

## Usage

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

// console.log
// { a: 'b' }
// foo { a: 'b' }
```

## Acknowledgments

Thanks to [mitt](https://github.com/developit/mitt) again for the inspiration.

## License

MIT © [nnecec](https://github.com/nnecec)
