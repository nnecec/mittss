# Usage

## Basic

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

## Typescript supported

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

## Extending Emitter

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

## Make `Mittss` functional

```typescript
const mitt = <Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>,
) => {
  return new Emitter<Events>(all)
}

const emitter = mitt()
```
