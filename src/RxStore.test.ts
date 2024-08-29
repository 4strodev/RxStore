import { RxStore } from "./RxStore";

interface MyStore {
	name: string;
	age: number;
}

const defaultValues: MyStore = {
	name: "asdfasd", age: 10
}

describe("RxStore select", () => {
	it("should return all or selected values", () => {
		const myStore = new RxStore<MyStore>(defaultValues);
		const selection = myStore.snapshotOnly((state) => state.age);
		console.log(selection);
		expect(selection).toEqual(10);
	});

	it("should execute interceptors", () => {
		let counter = 0;
		const store = new RxStore<MyStore>(defaultValues);
		store.addInterceptor(state => {
			counter ++;
			return state;
		});

		const expectedChanges = 10;
		for (let i = 0; i < expectedChanges; i ++) {
			store.patchState({age: i});
		}

		expect(counter).toEqual(expectedChanges);
	});
});
