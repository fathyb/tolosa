import {ObserveAdapter, registerObserver} from './observe'

registerObserver({
	test: obj => typeof obj === 'object' && typeof obj.then === 'function',
	subscribe(obj, listener) {
		obj.then(
			result => {
				listener.next(result)
				listener.complete()
			},
			listener.error
		)

		return null
	}
} as ObserveAdapter<Promise<any>>)
