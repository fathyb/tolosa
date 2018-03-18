// Mock the batcher to fire events synchronously
jest.mock('@tolosa/core/src/stream/batcher')

import '..'

import {emit, observe} from '@tolosa/core'
import {Subject} from 'rxjs'

it('should subscribe to streams', () => {
	const emitter = new Subject()
	const fn = jest.fn()
	const test = Math.random()

	observe(emitter, fn)

	emitter.next(test)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)

	emitter.next(test)

	expect(fn).toHaveBeenCalledTimes(2)
	expect(fn).toHaveBeenLastCalledWith(test)
})

it('should unsubscribe', () => {
	const emitter = new Subject()
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

it('should emit to emitters', () => {
	const emitter = new Subject()
	const fn = jest.fn()
	const test = Math.random()

	observe(emitter, fn)

	emit(emitter, test)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)

	emit(emitter, test)

	expect(fn).toHaveBeenCalledTimes(2)
	expect(fn).toHaveBeenLastCalledWith(test)
})
