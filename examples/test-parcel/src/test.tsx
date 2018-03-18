import {Emitter} from '@tolosa/most'
import {fromEvent, fromPromise} from 'most'

import axios from 'axios'

const incrementClick = new Emitter<Event>()
const decrementClick = new Emitter<Event>()
const progress = new Emitter<ProgressEvent>()
const mouse = fromEvent<MouseEvent>('mousemove', document)

export const Component =
	<div>
		<h2>
			counter : {
				incrementClick.constant(+1)
					.merge(decrementClick.constant(-1))
					.scan((acc, next) => acc + next, 0)
			}
		</h2>
		<button onClick={incrementClick}>Increment</button>
		<button onClick={decrementClick}>Decrement</button>
		{
			fromPromise(
				axios
					.get('https://upload.wikimedia.org/wikipedia/commons/a/a2/Nature-irkutsk-oblast-baikal.jpg', {
						onDownloadProgress: progress.bind(),
						responseType: 'blob'
					})
					.then(res =>
						<img
							src={URL.createObjectURL(res.data)}
							style={{
								maxWidth: 200,
								maxHeight: 200
							}}
						/>
					)
					.catch(err =>
						<pre>{err.stack}</pre>
					)
			)
			.startWith(
				<progress
					min='0'
					max='1'
					value={progress.map(evt => evt.loaded / evt.total)}
				/>
			)
		}
		<pre>
			{
				fromPromise(
					fetch('http://www.mocky.io/v2/5a7a464e2e000048009a5daf?mocky-delay=5s')
						.then(res => res.text())
				).startWith('Loading...')
			}
		</pre>
		<h3>Mouse position : {mouse.map(({x, y}) => `(${x}, ${y})`)}</h3>

		<div
			style={{
				position: 'fixed',
				top: -100, left: -100,
				background: 'green',
				width: 200,
				height: 200,
				transform: mouse.map(({x, y}) => `translate3d(${x}px, ${y}px, 0)`)
			}}
		/>
	</div>
