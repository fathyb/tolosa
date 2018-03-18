import {registerEmitter, registerObserver} from '@tolosa/core'
import {Stream} from 'most'

// We rename Emitter to EventEmitter to prevent a TypeScript
// recursive type error
import {Emitter as EventEmitter} from './emitter'

export {EventEmitter as Emitter}

declare global {
	namespace Tolosa {
		export interface ObservableSupport<T> {
			most: Stream<T>
		}
		export interface EmitterSupport<T> {
			most: EventEmitter<T>
		}
	}
}

registerObserver<Stream<any>>({
	test: obj => obj instanceof Stream,
	subscribe: (obj, subscriber) => {
		const subscription = obj.subscribe(subscriber)

		return () => subscription.unsubscribe()
	}
})

registerEmitter<EventEmitter<any>>({
	test: obj => obj instanceof EventEmitter,
	emit: (obj, data) => obj.next(data)
})
