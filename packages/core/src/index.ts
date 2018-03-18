declare global {
	namespace JSX {
		interface IntrinsicElements<T> {
			[key: string]: any
		}

		type Element = HTMLElement
	}
}

export * from './element'
export * from './stream'
