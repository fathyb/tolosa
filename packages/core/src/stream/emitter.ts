import {AllValues} from './utils/all-values.type'

declare global {
	namespace Tolosa {
		export interface EmitterSupport<T> {
			function: (data: T) => void
		}
	}
}

export type Emitter<T> = AllValues<Tolosa.EmitterSupport<T>>

export interface EmitAdapter<O extends Emitter<any>> {
	test(obj: any | O): boolean
	emit(emitter: O, data: any): void
}

const adapters = new Set<EmitAdapter<any>>()

export function registerEmitter<T extends Emitter<any>>(adapter: EmitAdapter<T>): void {
	adapters.add(adapter)
}

export function emit<T>(obj: T | Emitter<T>, data: T): void {
	if(typeof obj === 'function') {
		obj(data)

		return
	}

	for(const adapter of adapters) {
		if(adapter.test(obj)) {
			adapter.emit(obj, data)

			return
		}
	}

	throw new Error('Unknown emitter type')
}
