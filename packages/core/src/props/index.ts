import {DOMProps, JSXProps} from '../element'

import {applyAttribute} from './attribute'
import {applyEvent} from './event'
import {applyStyle} from './style'

export function mutateProps(node: Node, prevProps: DOMProps, nextProps: JSXProps) {
	const keys = Object.keys(nextProps)
	const {length} = keys

	for(let i = 0; i < length; i++) {
		const key = keys[i]

		applyProp(node, key, prevProps, nextProps[key])
	}
}

function applyProp(node: Node, prop: string, prev: DOMProps, next: JSXProps[string]): void {
	// if the prop begins with "on", we assume no HTML attributes begins with "on"
	if(prop[0] === 'o' && prop[1] === 'n') {
		applyEvent(node, prop, prev, next)
	}
	else if(prop === 'style' && node instanceof HTMLElement) {
		applyStyle(node, prev, next)
	}
	else {
		applyAttribute(node, prop, prev, next)
	}
}
