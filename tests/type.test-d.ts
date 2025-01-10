/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */

import { beforeEach, describe, expectTypeOf } from 'vitest'
import { Emitter, EventHandlerMap } from '../src'

describe(() => {
  type Events = {
    foo: string
    bar?: number
    data: Data
  }
  interface Data {
    name: string
  }

  let events: EventHandlerMap<Events>
  let emitter: Emitter<Events>
  let onFoo: (x: string) => void = (_event: string) => {}
  let onBar: (x?: number) => void = () => {}
  let onWildcard = (_type: 'foo' | 'bar' | 'data', _event: string | Data | number | undefined) => {}
  beforeEach(() => {
    events = new Map()
    emitter = new Emitter(events)
  })
  describe('.on()', () => {
    expectTypeOf(emitter.on).parameter(0).toMatchTypeOf<'foo' | 'bar' | '*' | 'data'>()
    expectTypeOf(emitter.on).parameter(1).parameter(0).toMatchTypeOf<string | number | Data | undefined>()

    emitter.on('foo', onFoo)
    // @ts-expect-error
    emitter.on('foo', onBar)
    // @ts-expect-error
    emitter.on('bar', onFoo)
    emitter.on('bar', onBar)

    emitter.on('*', onWildcard)
    // onFoo is ok, because ('foo' | 'bar' | 'data') extends string
    emitter.on('*', onFoo)
    // @ts-expect-error
    emitter.on('*', onBar)
  })

  describe('.off()', () => {
    expectTypeOf(emitter.off).parameter(0).toMatchTypeOf<'foo' | 'bar' | '*' | 'data'>()
    expectTypeOf(emitter.off).parameter(1).parameter(0).toMatchTypeOf<string | number | Data | undefined>()

    // @ts-expect-error
    emitter.off('foo', onBar)
    emitter.off('foo', onFoo)

    emitter.off('bar', onBar)
    // @ts-expect-error
    emitter.off('bar', onFoo)

    emitter.off('*', onWildcard)
    emitter.off('*', onFoo)
    // @ts-expect-error
    emitter.off('*', onBar)
  })

  describe('.emit()', () => {
    expectTypeOf(emitter.emit).parameter(0).toMatchTypeOf<'foo' | 'bar' | '*' | 'data'>()
    expectTypeOf(emitter.emit).parameter(1).toMatchTypeOf<string | number | Data | undefined>()

    // @ts-expect-error
    emitter.emit('data', 'NOT VALID')
    emitter.emit('data', { name: 'jack' })

    // @ts-expect-error
    emitter.emit('foo')
    // @ts-expect-error
    emitter.emit('foo', 1)
    emitter.emit('foo', 'string')

    emitter.emit('bar')
    emitter.emit('bar', 1)
    // @ts-expect-error
    emitter.emit('bar', 'string')
  })

  describe('.once()', () => {
    expectTypeOf(emitter.once).parameter(0).toMatchTypeOf<'foo' | 'bar' | '*' | 'data'>()
    expectTypeOf(emitter.once).parameter(1).toMatchTypeOf<string | number | Data | undefined>()

    emitter.once('foo', onFoo)
    // @ts-expect-error
    emitter.once('foo', onBar)
    // @ts-expect-error
    emitter.once('bar', onFoo)
    emitter.once('bar', onBar)

    emitter.once('*', onWildcard)
    // onFoo is ok, because ('foo' | 'bar' | 'data') extends string
    emitter.once('*', onFoo)
    // @ts-expect-error
    emitter.once('*', onBar)
  })
})
