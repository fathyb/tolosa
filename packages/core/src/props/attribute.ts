import {DOMProps, JSXProps} from '../element'
import {observe} from '../stream'

export function applyAttribute(node: Node, prop: string, prev: DOMProps, next: JSXProps[string]): void {
	let prevAttrs = prev.attributes[prop]

	if(prevAttrs) {
		if(prevAttrs.prop === next) {
			return
		}

		if(prevAttrs.unsubcriber !== null) {
			prevAttrs.unsubcriber()
		}
	}

	prev.attributes[prop] = prevAttrs = {
		prop: next,
		current: null,
		unsubcriber: null
	}

	if(!(node instanceof Element)) {
		return
	}

	prevAttrs.unsubcriber = observe(next, value => {
		if(prevAttrs.current === null || prevAttrs.current.value !== value) {
			prevAttrs.current = {value};
			(node as any)[prop] = value
		}
	})
}
