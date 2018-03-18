import {Batcher} from './batcher'
import {AllValues} from './utils/all-values.type'

declare global {
	namespace Tolosa {
		export interface ObservableSupport<T> {
			promise: Promise<T>
		}
	}
}

export type Observable<T> = AllValues<Tolosa.ObservableSupport<T>>
export type MaybeObservable<T> = T | Observable<T>

export interface Subscriber {
	next(value: any): void
	error(e: any): void
	complete(): void
}

export type Unsubscriber = () => void
export interface ObserveAdapter<O extends Observable<any>> {
	test(obj: any | O): boolean
	subscribe(obj: O, subscribe: Subscriber): Unsubscriber | null
}

const adapters = new Set<ObserveAdapter<any>>()

export function registerObserver<T extends Observable<any>>(adapter: ObserveAdapter<T>): void {
	adapters.add(adapter)
}

const batcher = new Batcher<{}>()

export function observe<T>(obj: T | Observable<T>, callback: (obj: T) => void): (() => void) | null {
	if(typeof obj !== 'object') {
		callback(obj)

		return null
	}

	for(const adapter of adapters) {
		if(!adapter.test(obj)) {
			continue
		}

		let unsubscribe: (() => void) | null = null
		let stop = false

		const subscriber: Subscriber = {
			next(o) {
				if(stop === false) {
					batcher.schedule(subscriber, () => callback(o))
				}
			},
			complete() {
				if(unsubscribe !== null) {
					unsubscribe()
				}

				unsubscribe = null
				stop = true
			},
			error(e) {
				subscriber.complete()
				console.error(e)

				throw e
			}
		}

		const result = adapter.subscribe(obj, subscriber)

		if(result === null) {
			return subscriber.complete
		}
		else if(typeof result === 'function') {
			return unsubscribe = function() {
				if(stop === false || unsubscribe !== null) {
					unsubscribe = null
					stop = true

					result()
				}
			}
		}
		else {
			throw new Error('Observer plugin result should be null, false, or a function')
		}
	}

	callback(obj as T)

	return null
}
