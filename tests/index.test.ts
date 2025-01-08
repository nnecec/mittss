import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Emitter, EventHandlerMap } from '../src'

describe('Emitter basics', () => {
  it('should export Emitter as a class', () => {
    expect(Emitter).toBeTypeOf('function')
    const emitter = new Emitter()
    expect(emitter).toBeInstanceOf(Emitter)
  })

  it('should accept an optional event handler map', () => {
    expect(() => new Emitter(new Map())).not.to.throw
    const map = new Map()
    const a = vi.fn()
    const b = vi.fn()
    map.set('foo', [a, b])
    const events = new Emitter(map)
    events.emit('foo')
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
  })
})

describe('Emitter features', () => {
  const eventType = Symbol('eventType')
  type Events = {
    foo: unknown
    constructor: unknown
    FOO: unknown
    bar: unknown
    Bar: unknown
    'baz:bat!': unknown
    'baz:baT!': unknown
    Foo: unknown
    [eventType]: unknown
  }

  let events: EventHandlerMap<Events>, emitter: Emitter<Events>
  beforeEach(() => {
    events = new Map()
    emitter = new Emitter(events)
  })
  describe('.all', () => {
    it('should expose the event handler map', () => {
      expect(emitter).toHaveProperty('all')
      expect(emitter.all).toBeInstanceOf(Map)
    })
  })
  describe('.on()', () => {
    it('should be a function', () => {
      expect(emitter).toHaveProperty('on')
      expect(emitter.on).toBeTypeOf('function')
    })
    it('should register handler for new type', () => {
      const foo = () => {}
      emitter.on('foo', foo)
      expect(events.get('foo')).toEqual([foo])
    })
    it('should register handlers for any type strings', () => {
      const foo = () => {}
      emitter.on('constructor', foo)
      expect(events.get('constructor')).toEqual([foo])
    })
    it('should append handler for existing type', () => {
      const foo = () => {}
      const bar = () => {}
      emitter.on('foo', foo)
      emitter.on('foo', bar)
      expect(events.get('foo')).toEqual([foo, bar])
    })
    it('should NOT normalize case', () => {
      const foo = () => {}
      emitter.on('FOO', foo)
      emitter.on('Bar', foo)
      emitter.on('baz:baT!', foo)
      expect(events.get('FOO')).toEqual([foo])
      expect(events.has('foo')).toBe(false)
      expect(events.get('Bar')).toEqual([foo])
      expect(events.has('bar')).toBe(false)
      expect(events.get('baz:baT!')).toEqual([foo])
    })
    it('can take symbols for event types', () => {
      const foo = () => {}
      emitter.on(eventType, foo)
      expect(events.get(eventType)).toEqual([foo])
    })
    // Adding the same listener multiple times should register it multiple times.
    // See https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
    it('should add duplicate listeners', () => {
      const foo = () => {}
      emitter.on('foo', foo)
      emitter.on('foo', foo)
      expect(events.get('foo')).toEqual([foo, foo])
    })
  })
  describe('.off()', () => {
    it('should be a function', () => {
      expect(emitter).to.have.property('off').that.is.a('function')
    })
    it('should remove handler for type', () => {
      const foo = () => {}
      emitter.on('foo', foo)
      emitter.off('foo', foo)
      expect(events.get('foo')).toEqual([])
    })
    it('should NOT normalize case', () => {
      const foo = () => {}
      emitter.on('FOO', foo)
      emitter.on('Bar', foo)
      emitter.on('baz:bat!', foo)
      emitter.off('FOO', foo)
      emitter.off('Bar', foo)
      emitter.off('baz:baT!', foo)
      expect(events.get('FOO')).toEqual([])
      expect(events.has('foo')).toBe(false)
      expect(events.get('Bar')).toEqual([])
      expect(events.has('bar')).toBe(false)
      expect(events.get('baz:bat!')).toHaveLength(1)
    })
    it('should remove only the first matching listener', () => {
      const foo = () => {}
      emitter.on('foo', foo)
      emitter.on('foo', foo)
      emitter.off('foo', foo)
      expect(events.get('foo')).toEqual([foo])
      emitter.off('foo', foo)
      expect(events.get('foo')).toEqual([])
    })
    it('off("type") should remove all handlers of the given type', () => {
      emitter.on('foo', () => {})
      emitter.on('foo', () => {})
      emitter.on('bar', () => {})
      emitter.off('foo')
      expect(events.get('foo')).toEqual([])
      expect(events.get('bar')).toHaveLength(1)
      emitter.off('bar')
      expect(events.get('bar')).toEqual([])
    })
  })
  describe('emit()', () => {
    it('should be a function', () => {
      expect(emitter).toHaveProperty('emit')
      expect(emitter.emit).toBeTypeOf('function')
    })
    it('should invoke handler for type', () => {
      const event = { a: 'b' }
      emitter.on('foo', (one, two?: unknown) => {
        expect(one).toEqual(event)
        expect(two).toBeUndefined()
      })
      emitter.emit('foo', event)
    })
    it('should NOT ignore case', () => {
      const onFoo = vi.fn()
      const onFOO = vi.fn()
      events.set('Foo', [onFoo])
      events.set('FOO', [onFOO])
      emitter.emit('Foo', 'Foo arg')
      emitter.emit('FOO', 'FOO arg')
      expect(onFoo).toBeCalledTimes(1)
      expect(onFoo).toBeCalledWith('Foo arg')
      expect(onFOO).toBeCalledTimes(1)
      expect(onFOO).toBeCalledWith('FOO arg')
    })
    it('should invoke * handlers', () => {
      const star = vi.fn()
      const ea = { a: 'a' }
      const eb = { b: 'b' }
      events.set('*', [star])
      emitter.emit('foo', ea)
      expect(star).toBeCalledTimes(1)
      expect(star).toBeCalledWith('foo', ea)
      star.mockReset()
      emitter.emit('bar', eb)
      expect(star).toBeCalledTimes(1)
      expect(star).toBeCalledWith('bar', eb)
    })
  })

  describe('once()', () => {
    it('should be a function', () => {
      expect(emitter).toHaveProperty('once')
      expect(emitter.once).toBeTypeOf('function')
    })
    it('should invoke handler once ', () => {
      const foo = vi.fn()
      emitter.once('foo', foo)
      emitter.emit('foo')
      expect(foo).toBeCalledTimes(1)
      expect(events.get('foo')).toEqual([])
    })
    it('should work with multiple once handlers', () => {
      const a = vi.fn()
      const b = vi.fn()
      emitter.once('foo', a)
      emitter.once('foo', b)
      expect(events.get('foo')).toHaveLength(2)
      emitter.emit('foo')
      expect(events.get('foo')).toEqual([])
    })

    it('should work with .on() as well', () => {
      const once = vi.fn()
      const on = vi.fn()
      emitter.once('foo', once)
      emitter.on('foo', on)
      emitter.emit('foo')
      expect(events.get('foo')).toEqual([on])
    })
    it('should NOT normalize case', () => {
      const foo = () => {}
      emitter.once('FOO', foo)
      emitter.once('Bar', foo)
      emitter.once('baz:baT!', foo)
      expect(events.get('FOO')).toHaveLength(1)
      expect(events.has('foo')).toBe(false)
      expect(events.get('Bar')).toHaveLength(1)
      expect(events.has('bar')).toBe(false)
      expect(events.get('baz:baT!')).toHaveLength(1)
    })
    it('should invoke * handlers', () => {
      const star = vi.fn()
      const moon = vi.fn()
      const ea = { a: 'a' }
      emitter.once('*', star)
      emitter.once('*', moon)
      emitter.emit('foo', ea)
      expect(star).toBeCalledTimes(1)
      expect(star).toBeCalledWith('foo', ea)
      expect(moon).toBeCalledTimes(1)
      expect(moon).toBeCalledWith('foo', ea)
      expect(events.get('*')).toEqual([])
    })
  })
})
