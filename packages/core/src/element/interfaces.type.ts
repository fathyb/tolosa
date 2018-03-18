import {Emitter, MaybeObservable} from '../stream'

export type JSXChildElementType = Node | {toString(): string}
export type JSXChildType = JSXChildElementType | JSXChildElementType[]
export type JSXChild = MaybeObservable<JSXChildType>

export interface JSXProps {
	[key: string]: MaybeObservable<any>
}

export interface DOMChildBase {
	raw: {
		value: JSXChild
		unsubcriber: null | (() => void)
	}
}
export interface DOMChildElement extends DOMChildBase {
	type: 'node'
	node: Node
}
export interface DOMChildText extends DOMChildBase {
	type: 'text'
	node: Text
	text: string
}
export interface DOMChildPartial extends DOMChildBase {
	type: 'partial'
}
export interface DOMChildList extends DOMChildBase {
	type: 'list'
	nodes: DOMElement[]
}

export type DOMChild = DOMChildElement | DOMChildText | DOMChildPartial | DOMChildList

export interface DOMElement {
	key?: string
	childs?: DOMChild[]

	node: Node
	props: DOMProps
}

export interface DOMProp<T = any> {
	prop: MaybeObservable<T>
	unsubcriber: null | (() => void)
	current: null | {
		value: T
	}
}

export interface DOMProps {
	style: DOMProp<{
		[key: string]: string | number
	}>
	events: {
		[key: string]: Emitter<Event>
	}
	attributes: {
		[key: string]: DOMProp
	}
}

export interface Bag {
	[key: string]: DOMElement
}
