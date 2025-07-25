import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";

const loadState = () => {
  try {
    const savedState = localStorage.getItem("todos-redux");
    return savedState ? JSON.parse(savedState) : undefined;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const todosData = {
      todos: state.todo.todos,
      // Add other state you want to persist
    };
    localStorage.setItem("todos-redux", JSON.stringify(todosData));
  } catch (err) {
    console.error("Failed to save state:", err);
  }
};

const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
  preloadedState: {
    todo: {
      ...todoReducer(undefined, { type: '@@INIT' }), // Get initial state
      ...loadState(), // Merge with saved state
    },
  },
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;