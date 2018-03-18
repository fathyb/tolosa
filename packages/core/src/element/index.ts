import {Bag, JSXChild, JSXProps} from './interfaces.type'
import {recycleElement} from './store'

export * from './interfaces.type'

export function h(
	tag: string, bag: Bag, id: string, key: string | null,
	props: JSXProps | null, childs: JSXChild[] | null
): Node {
	return recycleElement(
		bag,
		key
			? `${id}::-::${key}`
			: id,
		key, tag, props, childs
	)
}
