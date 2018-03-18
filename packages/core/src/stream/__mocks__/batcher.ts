export type BatcherCallback = () => void

export class Batcher<T> {
	public schedule(_: T, callback: BatcherCallback): void {
		callback()
	}
}
