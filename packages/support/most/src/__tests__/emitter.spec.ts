import {Emitter} from '../emitter'

{
	const emitter = new Emitter<number>()
	const subscriber = {
		next: jest.fn(),
		error: jest.fn(),
		complete: jest.fn()
	}
	const test = Math.random()
	const off = emitter.subscribe(subscriber)

	it('should emit values', () => {
		emitter.next(test)

		expect(subscriber.next).toHaveBeenCalledTimes(1)
		expect(subscriber.next).toHaveBeenCalledWith(test)

		emitter.next(test)

		expect(subscriber.next).toHaveBeenCalledTimes(2)
		expect(subscriber.next).toHaveBeenLastCalledWith(test)
	})

	it('should unsubscribe', () => {
		off.unsubscribe()
		emitter.next(test)

		expect(subscriber.next).toHaveBeenCalledTimes(2)
	})
}

it('should bind', () => {
	const emitter = new Emitter()
	const bind = emitter.bind()
	const fn = jest.fn()
	const test = Math.random()

	emitter.observe(fn)

	bind(test, null, undefined)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenLastCalledWith(test)
})

it('should bind with a map function', () => {
	const emitter = new Emitter()
	const bind = emitter.bind(x => x * 2)
	const fn = jest.fn()
	const test = Math.random()

	emitter.observe(fn)

	bind(test, null, undefined)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenLastCalledWith(test * 2)
})
