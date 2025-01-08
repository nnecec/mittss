export type EventType = string | symbol

// An event handler can take an optional event argument
// and should not return a value
type Handler<T = unknown> = (event: T) => void
type WildcardHandler<T = Record<string, unknown>> = (type: keyof T, event: T[keyof T]) => void

// An array of all currently registered event handlers for a type
type EventHandlerList<T = unknown> = Array<Handler<T>>
type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events | '*',
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>

type GenericEventHandler<Events extends Record<EventType, unknown>> =
  | Handler<Events[keyof Events]>
  | WildcardHandler<Events>

/**
 * Create a new emitter instance.
 * @class Emitter
 * @constructor
 *
 */
export class Emitter<Events extends Record<EventType, unknown>> {
  // A Map of event names to registered handler functions.
  public all: EventHandlerMap<Events>

  constructor(all?: EventHandlerMap<Events>) {
    this.all = all || new Map()
  }

  /**
   * Register an event handler for the given type.
   * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
   * @param {Function} handler Function to call in response to given event
   * @memberOf Emitter
   */
  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
  on(type: '*', handler: WildcardHandler<Events>): void
  on<Key extends keyof Events>(type: Key | '*', handler: GenericEventHandler<Events>): void {
    const handlers: Array<GenericEventHandler<Events>> | undefined = this.all.get(type)
    if (handlers) {
      handlers.push(handler)
    } else {
      this.all.set(type, [handler] as EventHandlerList<Events[keyof Events]>)
    }
  }

  /**
   * Remove an event handler for the given type.
   * If `handler` is omitted, all handlers of the given type are removed.
   *
   * @param {string|symbol} type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
   * @param {Function} [handler] Handler function to remove
   * @memberOf mitt
   */
  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void
  off(type: '*', handler: WildcardHandler<Events>): void
  off<Key extends keyof Events>(type: Key | '*', handler?: GenericEventHandler<Events>): void {
    const handlers: Array<GenericEventHandler<Events>> | undefined = this.all.get(type)
    if (handlers) {
      if (handler) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      } else {
        this.all.set(type, [])
      }
    }
  }

  /**
   * Invoke all handlers for the given type.
   * If present, `'*'` handlers are invoked after type-matched handlers.
   *
   * Note: Manually firing '*' handlers is not supported.
   *
   * @param {string|symbol} type The event type to invoke
   * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
   * @memberOf Emitter
   */
  emit<Key extends keyof Events>(type: Key, evt: Events[Key]): void
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void
  emit<Key extends keyof Events>(type: Key, evt?: Events[Key]): void {
    let handlers = this.all.get(type)
    if (handlers) {
      ;(handlers as EventHandlerList<Events[Key]>).slice().map(handler => {
        handler(evt!)
      })
    }

    handlers = this.all.get('*')
    if (handlers) {
      ;(handlers as WildCardEventHandlerList<Events>).slice().map(handler => {
        handler(type, evt!)
      })
    }
  }

  /**
   * Register an event handler for the given type that will be invoked only once.
   *
   * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
   * @param {Function} handler Function to call in response to given event
   * @memberOf Emitter
   */
  once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
  once(type: '*', handler: WildcardHandler<Events>): void
  once<Key extends keyof Events>(type: Key | '*', handler: GenericEventHandler<Events>): void {
    if (type === '*') {
      const onceHandler = ((type: Key, event: Events[Key]) => {
        ;(handler as WildcardHandler<Events>)(type, event)
        this.off('*', onceHandler as WildcardHandler<Events>)
      }) as WildcardHandler<Events>
      this.on(type, onceHandler)
    } else {
      const onceHandler = ((event: Events[Key]) => {
        ;(handler as Handler<Events[Key]>)(event)
        this.off(type, onceHandler as Handler<Events[Key]>)
      }) as Handler<Events[Key]>
      this.on(type, onceHandler)
    }
  }
}
