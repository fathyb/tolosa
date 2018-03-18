import {Scheduler, Sink, Stream} from 'most'

import {create} from 'most/lib/disposable/dispose'
import {tryEvent} from 'most/lib/source/tryEvent'

export class Emitter<T> extends Stream<T> {
	private context: null | {
		scheduler: Scheduler
		sink: Sink<T>
	} = null

	constructor() {
		super({
			run: (sink, scheduler) => {
				this.context = {sink, scheduler}

				return create(() => this.context = null)
			}
		})
	}

	public next(value: T) {
		const {context: ctx} = this

		if(ctx !== null) {
			tryEvent(ctx.scheduler.now(), value, ctx.sink)
		}
	}

	public bind(fn?: (...args: any[]) => T): (...args: any[]) => void {
		if(fn) {
			return (...args) => this.next(fn(...args))
		}
		else {
			return arg => this.next(arg)
		}
	}
}
