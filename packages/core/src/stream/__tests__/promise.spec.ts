jest.mock('../batcher')

import {observe} from '..'

it('should observe resolved promises', async () => {
	const fn = jest.fn()
	const test = 42
	const promise = Promise.resolve(test)

	observe(promise, fn)

	await promise

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)
})

it('should observe defered promises', async () => {
	const fn = jest.fn()
	const test = 42
	const promise = new Promise(resolve => setTimeout(() => resolve(test), 200))

	observe(promise, fn)

	await promise

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)
})
