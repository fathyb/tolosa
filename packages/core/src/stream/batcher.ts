export type BatcherCallback = () => void

export class Batcher<T> {
	private readonly next = new Map<T, BatcherCallback>()
	private waiting = false

	public schedule(owner: T, callback: BatcherCallback): void {
		this.next.set(owner, callback)

		if(!this.waiting) {
			this.waiting = true

			requestAnimationFrame(this.tick)
		}
	}

	private readonly tick = () => {
		const {next} = this

		for(const fn of next.values()) {
			fn()
		}

		next.clear()
		this.waiting = false
	}
}
