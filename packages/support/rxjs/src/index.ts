import {registerEmitter, registerObserver} from '@tolosa/core'

import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'

declare global {
	namespace Tolosa {
		export interface ObservableSupport<T> {
			rxjs: Observable<T>
		}
		export interface EmitterSupport<T> {
			rxjs: Subject<T>
		}
	}
}

registerObserver<Observable<any>>({
	test: obj => obj instanceof Observable,
	subscribe: (obj, subscriber) => {
		const subscription = obj.subscribe(subscriber)

		return () => subscription.unsubscribe()
	}
})

registerEmitter<Subject<any>>({
	test: obj => obj instanceof Subject,
	emit: (obj, data) => obj.next(data)
})
