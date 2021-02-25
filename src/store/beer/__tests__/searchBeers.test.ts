import { of } from "rxjs";
import { TestScheduler } from "rxjs/testing";

import {
  cancel,
  fetchFailed,
  fetchFulfilled,
  reset,
  search,
  setStatus,
} from "../actions";
import { initialState } from "../../config/configReducer";
import { searchBeersEpic } from "../epics";
import { searchInput } from "../../../services/Api";

// https://rxjs-dev.firebaseapp.com/guide/testing/internal-marble-tests
// https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
})

beforeEach(() => {
  testScheduler.frame = 0
})

it("produces correct actions (success)", () => {
  testScheduler.run(({ hot, cold, expectObservable }) => {
    const action$ = hot("a", {
      a: search("ship"),
    })

    const state$ = of({ config: initialState });

    const dependencies = {
      getJSON: (url: string) => {
        return cold("-a", {
          a: [{ name: "Beer 1" }],
        })
      },
      searchInput: searchInput,
    }

    // @ts-expect-error HotObservable can't pass into the ActionsObservable
    const output$ = searchBeersEpic(action$, state$, dependencies)
    // wait for 500ms then expect a & b
    expectObservable(output$).toBe("500ms ab", {
      a: setStatus("pending"),
      b: fetchFulfilled([{ name: "Beer 1" }]),
    })
  })
})

it("produces correct actions (error)", () => {
  testScheduler.run(({ hot, cold, expectObservable }) => {
    const action$ = hot("a", {
      a: search("ship"),
    });

    const state$ = of({ config: initialState });

    const dependencies = {
      getJSON: (url: string) => {
        return cold("-#", undefined, {
          response: {
            message: "oops!",
          },
        })
      },
      searchInput: searchInput,
    }

    // @ts-expect-error HotObservable can't pass into the ActionsObservable
    const output$ = searchBeersEpic(action$, state$, dependencies);
    expectObservable(output$).toBe("500ms ab", {
      a: setStatus("pending"),
      b: fetchFailed("oops!"),
    })
  })
})

it("produces correct actions (reset)", () => {
  testScheduler.run(({ hot, cold, expectObservable }) => {
    const action$ = hot("a 500ms -b", {
      a: search("ship"),
      b: cancel(),
    })

    const state$ = of({ config: initialState });

    const dependencies = {
      getJSON: (url: string) => {
        return cold("---a")
      },
      searchInput: searchInput,
    }

    // @ts-expect-error HotObservable can't pass into the ActionsObservable
    const output$ = searchBeersEpic(action$, state$, dependencies);
    expectObservable(output$).toBe("500ms a-b", {
      a: setStatus("pending"),
      b: reset()
    })
  })
})