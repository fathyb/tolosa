import {Emitter} from '@tolosa/most'

interface AddAction {
	type: 'add'
}

interface RemoveAction {
	type: 'remove'
	id: string
}

type Action = AddAction | RemoveAction

interface Todo {
	id: string
	todo: string
	remove: () => void
}
interface State {
	todos: Todo[]
}

let counter = 0

console.log('test')

function reducer(state: State, action: Action): State {
	switch(action.type) {
		case 'add':
			return {
				...state,
				todos: [
					...state.todos,
					createTodo(`test ${counter++}`)
				]
			}
		case 'remove':
			return {
				...state,
				todos: state.todos.filter(x => action.id !== x.id)
			}
		default:
			return state
	}
}

const add = new Emitter()

// We can emit action imperatively using this emitter
const bus = new Emitter<Action>()
const initialState: State = {
	todos: []
}

const createTodo = (todo: string, id: string = (counter++).toString(36)): Todo => ({
	id, todo,
	remove: () => bus.next({type: 'remove', id})
})

const ELEMENTS = 10

for(let i = 0; i < ELEMENTS; i++) {
	initialState.todos.push(
		createTodo(`todo ${i}`)
	)
}

const stateStream = bus
	.merge(add.constant<Action>({type: 'add'}))
	.scan(reducer, initialState)

document.body.appendChild(
	<div>
		<button onClick={add}>Add</button>
		<ul>
			{stateStream.map(state => {
				const start = performance.now()
				const todos = state.todos.map(todo =>
					<li key={todo.id}>
						<span>{todo.todo}</span>
						<button onClick={todo.remove}>delete</button>
					</li>
				)
				const time = performance.now() - start

				console.log('Time : %.2f ms total, %.2f us per element (%d)', time, time / ELEMENTS * 1000, ELEMENTS)

				return todos
			})}
		</ul>
	</div>
)
