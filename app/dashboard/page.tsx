'use client'

import { useEffect, useState } from 'react'
import LogoutButton from '@/app/components/LogoutButton'

type Todo = {
  id: number
  title: string
  completed: boolean
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/todos/get')
      if (res.ok) {
        const data = await res.json()
        setTodos(data)
      }
      setLoading(false)
    }

    fetchTodos()
  }, [])

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/todos/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })

    if (res.ok) {
      const newTodo = await res.json()
      setTodos([newTodo, ...todos])
      setTitle('')
    }
  }

  const handleDelete = async (id: number) => {
    const res = await fetch('/api/todos/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      setTodos(todos.filter((todo) => todo.id !== id))
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
  }

  const handleUpdate = async () => {
    const res = await fetch('/api/todos/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, title: editTitle }),
    })

    if (res.ok) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, title: editTitle } : todo
        )
      )
      setEditingId(null)
      setEditTitle('')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <LogoutButton />
      </div>

      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New Todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="p-5 border rounded flex justify-between items-center"
            >
              {editingId === todo.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border px-2 py-2 text-2xl rounded w-full"
                  />
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white p-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 text-black p-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="w-full text-2xl">{todo.title}</span>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="bg-yellow-400 border text-black p-2 rounded hover:bg-white hover:text-yellow-400 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="bg-red-400 border text-black p-2 rounded hover:bg-white hover:text-red-400 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { Plus, Edit2, Trash2, Save, X, CheckCircle2 } from 'lucide-react'
// import LogoutButton from '../components/LogoutButton'

// type Todo = {
//   id: number
//   title: string
//   completed: boolean
// }

// export default function Dashboard() {
  
//   const [todos, setTodos] = useState<Todo[]>([
//     { id: 1, title: "Complete project proposal", completed: false },
//     { id: 2, title: "Review team feedback", completed: true },
//     { id: 3, title: "Schedule client meeting", completed: false }
//   ])
//   const [title, setTitle] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [editingId, setEditingId] = useState<number | null>(null)
//   const [editTitle, setEditTitle] = useState('')

//   useEffect(() => {
//     const fetchTodos = async () => {
//       // Simulated API call for demo
//       setLoading(false)
//     }
//     fetchTodos()
//   }, [])

//   const handleAddTodo = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!title.trim()) return

//     // Simulated API call
//     const newTodo: Todo = {
//       id: Date.now(),
//       title: title.trim(),
//       completed: false
//     }
    
//     setTodos([newTodo, ...todos])
//     setTitle('')
//   }

//   const handleDelete = async (id: number) => {
//     setTodos(todos.filter((todo) => todo.id !== id))
//   }

//   const handleEdit = (todo: Todo) => {
//     setEditingId(todo.id)
//     setEditTitle(todo.title)
//   }

//   const handleUpdate = async () => {
//     if (!editTitle.trim()) return

//     setTodos(
//       todos.map((todo) =>
//         todo.id === editingId ? { ...todo, title: editTitle.trim() } : todo
//       )
//     )
//     setEditingId(null)
//     setEditTitle('')
//   }

//   const toggleComplete = async (id: number) => {
//     // Find the current todo
//     const currentTodo = todos.find(todo => todo.id === id)
//     if (!currentTodo) return

//     const newCompletedState = !currentTodo.completed

//     // Optimistic update - update UI immediately
//     setTodos(
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, completed: newCompletedState } : todo
//       )
//     )

//     // Make API call to persist the change using existing update endpoint
//     try {
//       const res = await fetch('/api/todos/update', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           id: id, 
//           title: currentTodo.title,
//           completed: newCompletedState
//         }),
//       })

//       // If API call fails, revert the optimistic update
//       if (!res.ok) {
//         setTodos(
//           todos.map((todo) =>
//             todo.id === id ? { ...todo, completed: !newCompletedState } : todo
//           )
//         )
//         console.error('Failed to update todo completion status')
//       }
//     } catch (error) {
//       // Revert optimistic update on error
//       setTodos(
//         todos.map((todo) =>
//           todo.id === id ? { ...todo, completed: !newCompletedState } : todo
//         )
//       )
//       console.error('Error updating todo completion:', error)
//     }
//   }

//   const completedCount = todos.filter(todo => todo.completed).length
//   const totalCount = todos.length

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
//             <p className="text-gray-600">Manage your tasks and stay organized</p>
//           </div>
//           <LogoutButton />
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           {/* Add Todo Form */}
//           <div className="p-6 border-b border-gray-100 bg-gray-50">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
//             <div className="flex gap-3">
//               <div className="flex-1">
//                 <input
//                   type="text"
//                   placeholder="What needs to be done?"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddTodo(e)}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
//                 />
//               </div>
//               <button 
//                 onClick={handleAddTodo}
//                 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Task
//               </button>
//             </div>
//           </div>

//           {/* Todo List */}
//           <div className="p-6">
//             {loading ? (
//               <div className="flex items-center justify-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span className="ml-3 text-gray-600">Loading tasks...</span>
//               </div>
//             ) : todos.length === 0 ? (
//               <div className="text-center py-12">
//                 <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg">No tasks yet</p>
//                 <p className="text-gray-400 text-sm">Add your first task above to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h3>
//                 {todos.map((todo) => (
//                   <div
//                     key={todo.id}
//                     className={`group p-4 border rounded-lg transition-all hover:shadow-sm ${
//                       todo.completed 
//                         ? 'bg-green-50 border-green-200' 
//                         : 'bg-white border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     {editingId === todo.id ? (
//                       <div className="flex items-center gap-3">
//                         <input
//                           value={editTitle}
//                           onChange={(e) => setEditTitle(e.target.value)}
//                           className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                           autoFocus
//                         />
//                         <div className="flex gap-2">
//                           <button
//                             onClick={handleUpdate}
//                             className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
//                             title="Save"
//                           >
//                             <Save className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => setEditingId(null)}
//                             className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
//                             title="Cancel"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-3">
//                         <button
//                           onClick={() => toggleComplete(todo.id)}
//                           className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
//                             todo.completed
//                               ? 'bg-green-500 border-green-500 text-white'
//                               : 'border-gray-300 hover:border-green-400'
//                           }`}
//                         >
//                           {todo.completed && <CheckCircle2 className="w-3 h-3" />}
//                         </button>
                        
//                         <span className={`flex-1 ${
//                           todo.completed 
//                             ? 'text-green-700 line-through' 
//                             : 'text-gray-900'
//                         }`}>
//                           {todo.title}
//                         </span>
                        
//                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <button
//                             onClick={() => handleEdit(todo)}
//                             className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="Edit"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(todo.id)}
//                             className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Progress Bar */}
//         {totalCount > 0 && (
//           <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-medium text-gray-600">Progress</span>
//               <span className="text-sm text-gray-500">
//                 {completedCount} of {totalCount} completed
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
//               ></div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }