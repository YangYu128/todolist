import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInput,
  setDueDate,
  addTodo,
  cancelEdit,
  saveEditTodo,
} from "../../redux/todoSlice";

function TodoInput() {
  const dispatch = useDispatch();
  const { input, dueDate, editIndex, todos } = useSelector(state => state.todo);
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editIndex !== null) {
      const currentTodo = todos[editIndex];
      dispatch(saveEditTodo({ id: currentTodo.id, text: input, dueDate }));
    } else {
      dispatch(addTodo({ text: input, dueDate }));
    }
  };

  return (
    <div className="todo-input-form w-full border border-gray-300 rounded-xl p-6 shadow-md bg-gradient-to-r from-blue-50 to-white">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {editIndex !== null ? "Edit Task" : "Add New Task"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            placeholder="Enter a task"
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <input
            type="date"
            value={dueDate}
            min={today}
            onChange={(e) => dispatch(setDueDate(e.target.value))}
            className="w-full sm:w-auto px-4 py-2 border-2 border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className={`px-4 py-2 w-full ${
                editIndex !== null ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
              } text-white font-medium rounded-lg transition shadow-md`}
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                onClick={() => dispatch(cancelEdit())}
                className="px-4 py-2 w-full bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition shadow-md"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        {!input.trim() && (
          <p className="text-red-500 text-sm">Please enter a task description</p>
        )}
      </form>
    </div>
  );
}

export default TodoInput;
