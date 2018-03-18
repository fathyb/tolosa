import {DOMProps, JSXProps} from '../element'
import {observe} from '../stream'

export function applyStyle(node: HTMLElement, prev: DOMProps, next: JSXProps[string]): void {
	const {style} = prev

	if(style.prop === next || (style.current !== null && style.current.value === next)) {
		return
	}

	if(style.unsubcriber) {
		style.unsubcriber()
	}

	const unsubs: Array<null | (() => void)> = []

	style.unsubcriber = () => unsubs.forEach(f => f !== null && f())
	style.prop = next

	unsubs.push(
		observe(next, value => {
			if(style.current !== null && style.current.value === value) {
				return
			}

			const keys = Object.keys(value)
			const {length} = keys

			style.current = {value}

			for(let i = 0; i < length; i++) {
				const key = keys[i]
				const unsub = observe(value[key], obj =>
					node.style[key as any] = typeof obj === 'number'
						? `${obj}px`
						: obj
				)

				if(unsub !== null) {
					unsubs.push(unsub)
				}
			}
		})
	)
}
