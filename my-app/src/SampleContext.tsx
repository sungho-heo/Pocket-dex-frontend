import React, { useReducer, useContext, createContext, Dispatch } from "react";

// 필요한 타입 선언

type Color = "red" | "orange" | "yellow";

// 상태 확인을 위한 타입
type State = {
  count: number;
  text: string;
  color: Color;
  isGood: boolean;
};

// 모든 액션을 위한 타입

type Action =
  | { type: "SET_COUNT"; count: number }
  | { type: "SET_TEXT"; text: string }
  | { type: "SET_COLOR"; color: Color }
  | { type: "TOGGLE_GOOD" };

// 디스패치를 위한 타입 (Dispatch 를 리액트에서 불러올 수 있다), 액션들의 타입을 Dispatch 의 Generics로 설정한다. 여러개의 타입을 사용해야하기때문
type SampleDispatch = Dispatch<Action>;

// context
const SampleStateContext = createContext<State | null>(null); //default type null
const SampleDispatchContext = createContext<SampleDispatch | null>(null);

// reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_COUNT":
      return {
        ...state,
        count: action.count,
      };
    case "SET_TEXT":
      return {
        ...state,
        text: action.text,
      };
    case "SET_COLOR":
      return {
        ...state,
        color: action.color,
      };
    case "TOGGLE_GOOD":
      return {
        ...state,
        isGood: !state.isGood,
      };
    default:
      throw new Error("Unhandled action");
  }
}

// SampleProvider 에서 useReduer를 사용을 하고
// SampleStateContext.Provider 와 SampleDispatchContext.Provider 로 children 을 감싸서 반환합니다.
export function SampleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    text: "hello",
    color: "red",
    isGood: true,
  });

  return (
    <SampleStateContext.Provider value={state}>
      <SampleDispatchContext.Provider value={dispatch}>
        {children}
      </SampleDispatchContext.Provider>
    </SampleStateContext.Provider>
  );
}

// state 와 dispatch 쉽게 사용하기위해 커스텀 Hooks를 사용.
export function useSampleState() {
  const state = useContext(SampleStateContext);
  if (!state) throw new Error("Cannot find SampleProvider"); // 유효하지 않을경우 에러 발생.
  return state;
}

export function useSampleDispatch() {
  const dispatch = useContext(SampleDispatchContext);
  if (!dispatch) throw new Error("Cannot find SampleProvider"); //useSamplestate와 동일
  return dispatch;
}
