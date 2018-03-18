import {DOMProps, JSXProps} from '../element'
import {emit} from '../stream'

export function applyEvent(node: Node, prop: string, prev: DOMProps, next: JSXProps[string]): void {
	const event = prop.toLowerCase()

	if(prev.events[event] === next) {
		return
	}

	(node as any)[event] = (evt: Event) => void emit(next, evt)
	prev.events[event] = next
}
