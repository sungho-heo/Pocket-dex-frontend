import { createAction, ActionType, createReducer } from "typesafe-actions";

// 액션 타입 선언.
const ADD_TODO = "todos/ADD_TODO";
const TOGGLE_TODO = "todos/TOGGLE_TODO";
const REMOVE_TODO = "todos/REMOVE_TODO";

let nextId = 1; // 새로운 항목을 추가할시 사용할 고유 ID값.

// 액션 생성 함수

/*
이 액션 생성 함수의 경우엔 파라미터를 기반하여 커스터마이징된 payload를 설정해주므로,
createAction 이라는 함수를 사용합니다.
문법이 바뀌어서 action을 사용하지않습니다.
*/
export const addTodo = createAction(ADD_TODO, (text: string) => ({
  id: nextId++,
  text: text,
}))<Todo>();

// 위 코드는 다음과 같은 형태로도 구현 할 수 있지만, createAction 말고 action 만 사용하면
// Action Helpers (https://www.npmjs.com/package/typesafe-actions#action-helpers-api) 지원이 안된다.
// export const addTodo = (text: string) => action(ADD_TODO, { id: nextId++, text })

// payload가 그대로 들어가는 함수의 경우
export const toggleTodo = createAction(TOGGLE_TODO)<number>();
export const removeTodo = createAction(REMOVE_TODO)<number>();

// 모든 액션 객체에대한 타입 선언.
const actions = {
  addTodo,
  toggleTodo,
  removeTodo,
};
// 리팩토링
type TodosAction = ActionType<typeof actions>;

// 상태에서 사용 할 할 일 항목 데이터 타입 선언
export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

// 이 모듈에서 관리할 상태는 Todo 객체로 이루어진 배열 선언
export type TodosState = Todo[];

// 초기 상태 선언
const initialState: TodosState = [];

// 리듀서 작성
// 리펙토링
const todos = createReducer<TodosState, TodosAction>(initialState, {
  [ADD_TODO]: (state, action) =>
    state.concat({
      ...action.payload, //id ,text 전부 안에 넣기
      done: false,
    }),
  // 비구조화 할당을 활용해서 payload값을 변경하는게 가능
  [TOGGLE_TODO]: (state, { payload: id }) =>
    state.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ),
  [REMOVE_TODO]: (state, { payload: id }) =>
    state.filter((todo) => todo.id !== id),
});
// 기존
// function todos(
//   state: TodosState = initialState,
//   action: TodoAction
// ): TodosState {
//   switch (action.type) {
//     case ADD_TODO:
//       return state.concat({
//         // action.payload 객체 안의 값이 모두 유추된다.
//         id: action.payload.id,
//         text: action.payload.text,
//         done: false,
//       });
//     case TOGGLE_TODO:
//       return state.map((todo) =>
//         // payload가 number인것을 유추할수있음.
//         todo.id === action.payload ? { ...todo, done: !todo.done } : todo
//       );
//     case REMOVE_TODO:
//       // payload가 number인것을 유추함.
//       return state.filter((todo) => todo.id !== action.payload);
//     default:
//       return state;
//   }
// }

export default todos;
