# Rx Store
A reactive store focused on simplicity, explicitness and extensibility.

## Main features
- **Type safety**: With Rx Store you can use typescript type checking.
Unless redux and similar tools uses TypeScript features to allow
you to avoid runtime errors.
- **Easy to learn and use**: A store is a wrapper object that contains
an observable. Giving you an API to interact with this Subject.
  - No boilerplate code.
  - No FP patterns.
  - Choose between select an observable or a snapshot value.
- **Easy to extend**: Thanks to the usage of interceptors you can extend
the behaviour of your Stores.
- **No nested stores**: For the moment there is no possible to create nested stores.
Less is more, create a store for each context. If you want side effects you can use
Observables or interceptors.

## Examples

### Create a Store

```typescript
import {RxStore} from "@zertifier/rx-store";

export interface UserStore {
  id: number;
  email: string;
  name: string;
}

// These are the zero values. When a store is reset this values will be set to the store
const userStore = new RxStore<UserStore>({id: 0, email: '', name: ''});

const id$ = userStore.select(store => store.id);
id$.subscribe(value => console.log(`new Id ${value}`));

userStore.patchState({id: 1}); // new Id 1
userStore.patchState({id: 2}); // new Id 2
userStore.patchState({id: 3}); // new Id 3
```