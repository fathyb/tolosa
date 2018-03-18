import {mutateProps} from '..'
import {DOMProps} from '../../element/interfaces.type'

it('should set a event listener', () => {
	const prev: DOMProps = {
		style: {
			prop: {},
			unsubcriber: null,
			current: null
		},
		events: {},
		attributes: {}
	}
	const node: any = document.createElement('div')
	const onTest = jest.fn()
	const test = {}

	mutateProps(node, prev, {onTest})

	node.ontest(test)

	expect(onTest).toHaveBeenCalledTimes(1)
	expect(onTest).toHaveBeenLastCalledWith(test)
})
