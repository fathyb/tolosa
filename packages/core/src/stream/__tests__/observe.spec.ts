jest.mock('../batcher')

import {observe, registerObserver, Subscriber} from '..'

it('should directly resolve unknown values', () => {
	const fn = jest.fn()
	let test: any = 42

	observe(test, fn)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)

	test = {}

	observe(test, fn)

	expect(fn).toHaveBeenCalledTimes(2)
	expect(fn).toHaveBeenCalledWith(test)
})

{
	const test: Partial<Subscriber> = {}

	registerObserver<any>({
		test: obj => obj === test,
		subscribe: (obj, {complete, next}) => {
			obj.next = next
			obj.complete = complete

			return null
		}
	})

	const listen = jest.fn()
	const testVal = {}
	let off = observe(test, listen)

	it('should register custom observers', () => {
		test.next!(testVal)

		expect(listen).toHaveBeenCalledTimes(1)
		expect(listen).toHaveBeenCalledWith(testVal)

		test.next!(testVal)

		expect(listen).toHaveBeenCalledTimes(2)
		expect(listen).toHaveBeenLastCalledWith(testVal)
	})

	it('should ignore next values when unsubscribed', () => {
		off!()
		test.next!(testVal)

		expect(listen).toHaveBeenCalledTimes(2)
	})

	it('should resubscribe when needed', () => {
		off = observe(test, listen)
		test.next!(testVal)

		expect(listen).toHaveBeenCalledTimes(3)
		expect(listen).toHaveBeenLastCalledWith(testVal)
	})

	it('should stop listening when the stream is completed', () => {
		test.complete!()
		test.next!(testVal)

		expect(listen).toHaveBeenCalledTimes(3)
	})
}
