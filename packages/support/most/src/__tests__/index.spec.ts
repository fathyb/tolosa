// Mock the batcher to fire events synchronously
jest.mock('@tolosa/core/src/stream/batcher')

import {Emitter} from '..'

import {emit, observe} from '@tolosa/core'

it('should subscribe to streams', () => {
	const emitter = new Emitter()
	const fn = jest.fn()
	const test = Math.random()

	observe(emitter, fn)

	emitter.next(test)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)
})

it('should emit to emitters', () => {
	const emitter = new Emitter()
	const fn = jest.fn()
	const test = Math.random()

	observe(emitter, fn)

	emit(emitter, test)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)
})

it('should unsubscribe', () => {
	const emitter = new Emitter()
	const fn = jest.fn()
	const test = Math.random()
	const off = observe(emitter, fn)

	expect(off).not.toBeNull()

	emitter.next(test)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)

	off!()

	emitter.next(test)

	expect(fn).toHaveBeenCalledTimes(1)
})
