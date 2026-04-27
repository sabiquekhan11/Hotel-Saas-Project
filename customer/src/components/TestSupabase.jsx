import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function TestSupabase() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('todos').select()

      if (todos) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div className="bg-white shadow rounded-lg p-6 m-4 mt-8">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Supabase Todos Test</h2>
      {todos && todos.length > 0 ? (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="p-3 bg-slate-50 border border-slate-200 rounded">
              {todo.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500">No todos found or still loading...</p>
      )}
    </div>
  )
}
