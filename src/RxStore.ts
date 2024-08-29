import _ from "lodash";
import {BehaviorSubject, distinctUntilChanged, Observable, of, switchMap} from "rxjs";

export type Selector<T, R> = (val: T) => R;
export type Interceptor<T> = (state: T) => T;

/**
 * A store is an object that allows you to save data as observables
 */
export class RxStore<T> {
	private readonly _defaults: T;
	// State is the core of the store.
	// Is a behaviour subject that will emit the changes to their subscribers
	private _state: BehaviorSubject<T>;
	private readonly _stateObservable: Observable<T>;
	private interceptors: Interceptor<T>[] = [];

	constructor(zeroValues: T) {
		this._defaults = {...zeroValues};
		this._state = new BehaviorSubject<T>({...this._defaults});
		this._stateObservable = this._state.asObservable().pipe(distinctUntilChanged(this.checkEquals));
	}

	/**
	 * Return values of store as an observable. If selector is provided returns the selected values
	 */
	public select(): Observable<T> {
		return this._stateObservable.pipe(distinctUntilChanged(this.checkEquals));
	}

	/**
	 * Return a portion of store as observable using provided selector.
	 */
	public selectOnly<R>(selector: Selector<T, R>): Observable<R> {
		return this._stateObservable.pipe(
			switchMap((state) => of(selector(state))),
			distinctUntilChanged(this.checkEquals),
		);
	}

	/**
	 * Return an object containing values of store at the moment of take snapshot. IF selector is provided, returns the selected values
	 */
	public snapshot(): T {
		return {...this._state.value};
	}

	/**
	 * Return an object containing a portion of store at the moment of take snapshot using provided selector.
	 */
	public snapshotOnly<R>(selector: Selector<T, R>): R {
		return selector({...this._state.value});
	}

	/**
	 * Override all state setting provided value.
	 */
	public setState(state: T) {
		let newState = state;
		for (const interceptor of this.interceptors) {
			newState = interceptor(newState);
		}
		this._state.next({...newState});
	}

	/**
	 * Override only provided state portion.
	 */
	public patchState(fields: Partial<T>) {
		let newState: T = {...this._state.value, ...fields};
		for (const interceptor of this.interceptors) {
			newState = interceptor(newState);
		}
		this._state.next(newState);
	}

	public resetDefaults() {
		this.setState({...this._defaults});
	}

	/**
	 * Adds a new interceptor to the interceptor stack
	 * @param interceptor
	 */
	public addInterceptor(interceptor: Interceptor<T>): void {
		this.interceptors.push(interceptor);
	}

	/**
	 * Check if two values are equal even with objects.
	 */
	private checkEquals<T>(previous: T, current: T): boolean {
		return _.isEqual(previous, current);
	}
}
