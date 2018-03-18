
const App = () =>
	<div>
		<h2>Tolosa</h2>
		<h4>A fast, functional, reactive and declarative web framework.</h4>
	</div>

document.body.appendChild(App())

const initial = 0
const render = (counter: number) =>
    <div>
		<button onClick={() => render(++counter)}>Increment</button>
		<button onClick={() => render(--counter)}>Decrement</button>
		<h2>Counter : {counter}</h2>
    </div>

document.body.appendChild(render(initial))