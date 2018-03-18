jest.mock('../batcher')

import {registerEmitter, registerObserver} from '..'

export type Listener<T> = (data: T) => void

export class TestEmitter<T> {
	private readonly listeners = new Set<Listener<T>>()

	public next(data: T) {
		this.listeners.forEach(next => next(data))
	}

	public observe(listener: Listener<T>) {
		this.listeners.add(listener)

		return () => this.listeners.delete(listener)
	}
}

declare global {
	namespace Tolosa {
		export interface EmitterSupport<T> {
			testEmitter: TestEmitter<T>
		}
		export interface ObservableSupport<T> {
			testEmitter: TestEmitter<T>
		}
	}
}

registerEmitter<TestEmitter<any>>({
	test: obj => obj instanceof TestEmitter,
	emit: (obj, data) => obj.next(data)
})

registerObserver<TestEmitter<any>>({
	test: obj => obj instanceof TestEmitter,
	subscribe: (obj, subscriber) => obj.observe(subscriber.next)
})
