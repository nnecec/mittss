# API

## Types

```typescript
type EventType = string | symbol

type Handler<T> = (event?: T) => void

type WildcardHandler<T> = (type: EventType, event?: T) => void
```

## Emitter

```typescript
import { Emitter } from 'mittss'

const emitter = new Emitter(all?)
```

### Parameters

- all `Map<record<EventType, unknown>>?`

  A Map of event names to registered handler functions.

## on

Register an event handler for the given type.

```typescript
const onWildcard = (type, ev) => {}
emitter.on('*', onWildcard)

const onFoo = ev => {}
emitter.on('foo', onFoo)
```

### Parameters

- `type` `EventType | '*'`

  Type of event to listen for, or `'*'` for all events

- `handler` `Handler<T> | WildcardHandler<T>`

  Function to call in response to given event

## off

Remove an event handler for the given type. If `handler` is omitted, all
handlers of the given type are removed.

```typescript
const onFoo = ev => {}
emitter.on('foo', onFoo)
emitter.off('foo', onFoo)
```

### Parameters

- `type` `EventType | '*'`

  Type of event to unregister `handler` from, or `'*'`

- `handler` `Handler<T> | WildcardHandler<T>?`

  Handler function to remove

## emit

Invoke all handlers for the given type. If present, `'*'` handlers are invoked
after type-matched handlers.

Note: Manually firing '\*' handlers is not supported.

```typescript
const onFoo = ev => {} // ev: { foo: 'bar' }
emitter.on('foo', onFoo)
emitter.emit('foo', { foo: 'bar' })
```

### Parameters

- `type` `EventType`

  The event type to invoke

- `event` `any?`

  Any value (object is recommended and powerful), passed to each handler

## once

Invoke a handler for the given type. If present, `'*'` handlers areinvoked after
type-matched handlers.

The handler will be removed after its first invoke.

```typescript
const onFoo = ev => {} // ev: { foo: 'bar' }
emitter.once('foo', onFoo)
// emitter.all.get('foo')  return [ Function onFoo]
emitter.emit('foo', { foo: 'bar' })
// emitter.all.get('foo')  return []
```

### Parameters

- `type` `EventType | '*'`

  The event type to invoke

- `handler` `Handler<T> | WildcardHandler<T>`

  Any value (object is recommended and powerful), passed to each handler
