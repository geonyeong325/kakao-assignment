import TodoItem from './TodoItem';

export default function TodoList({ todos, emptyMessage, onToggle, onDelete, onEdit }) {
  return (
    <>
      <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="text-center text-[#bbb] text-[0.9rem] mt-[52px]">{emptyMessage}</p>
      )}
    </>
  );
}
