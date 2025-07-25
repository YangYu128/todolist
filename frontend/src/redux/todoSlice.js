import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Backend URL
const BACKEND_URL = 'http://localhost:5000';

// ----------------------------
// ✅ Async Thunks
// ----------------------------

export const fetchTodos = createAsyncThunk('todo/fetchTodos', async () => {
  const res = await fetch(`${BACKEND_URL}/api/todos`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return await res.json();
});

export const addTodo = createAsyncThunk('todo/addTodo', async ({ text, dueDate }) => {
  const res = await fetch(`${BACKEND_URL}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, dueDate }),
  });
  if (!res.ok) throw new Error('Failed to add todo');
  return await res.json();
});

export const toggleTodo = createAsyncThunk('todo/toggleTodo', async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/todos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to toggle todo');
  return id;
});

export const deleteTodo = createAsyncThunk('todo/deleteTodo', async (id) => {
  const res = await fetch(`${BACKEND_URL}/api/todos/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  return id;
});

// ✅ NEW: Save Edit Todo to backend
export const saveEditTodo = createAsyncThunk('todo/saveEditTodo', async ({ id, text, dueDate }) => {
  const res = await fetch(`${BACKEND_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, dueDate }),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return await res.json();
});

// ----------------------------
// ✅ Initial State
// ----------------------------

const initialState = {
  todos: [],
  input: '',
  dueDate: '',
  filter: 'all',     // 'all', 'completed', 'incomplete'
  editIndex: null,
};

// ----------------------------
// ✅ Slice
// ----------------------------

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setDueDate: (state, action) => {
      state.dueDate = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    startEdit: (state, action) => {
      state.editIndex = action.payload;
      const todo = state.todos[action.payload];
      state.input = todo?.text || '';
      state.dueDate = todo?.dueDate || '';
    },
    cancelEdit: (state) => {
      state.editIndex = null;
      state.input = '';
      state.dueDate = '';
    },
    // Optional: keep local-only saveEdit reducer if needed
    saveEdit: (state, action) => {
      const index = state.editIndex;
      if (index !== null && state.todos[index]) {
        state.todos[index].text = state.input;
        state.todos[index].dueDate = state.dueDate;
      }
      state.editIndex = null;
      state.input = '';
      state.dueDate = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const todo = state.todos.find((t) => t.id === action.payload);
        if (todo) todo.completed = !todo.completed;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      })
      .addCase(saveEditTodo.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.todos.findIndex((t) => t.id === updated.id);
        if (index !== -1) {
          state.todos[index] = updated;
        }
        state.editIndex = null;
        state.input = '';
        state.dueDate = '';
      });
  },
});

// ----------------------------
// ✅ Exports
// ----------------------------

export const {
  setInput,
  setDueDate,
  setFilter,
  startEdit,
  cancelEdit,
  saveEdit, // Optional: only used for local updates
} = todoSlice.actions;

export default todoSlice.reducer;
