import {emit, registerEmitter} from '..'

it('should emit on functions', () => {
	const fn = jest.fn()
	const test = {}

	emit(fn, test)

	expect(fn).toHaveBeenCalledTimes(1)
	expect(fn).toHaveBeenCalledWith(test)
})

declare global {
	namespace Tolosa {
		export interface EmitterSupport<T> {
			unitTestEmitter: {
				emit: (data: T) => void
			}
		}
	}
}

it('should register emitters', () => {
	const test = {}
	const emitter = {
		emit: jest.fn()
	}

	registerEmitter<typeof emitter>({
		test: obj => obj === emitter,
		emit: (obj, data) => obj.emit(data)
	})

	emit(emitter, test)

	expect(emitter.emit).toHaveBeenCalledTimes(1)
	expect(emitter.emit).toHaveBeenCalledWith(test)
})

it('should throw if the emitter is not known', () => {
	expect(() => emit({}, {})).toThrow()
})
