import type { ToDo } from '@/models/todo'
import axios from 'axios'

export const getToDoList = async () => {
  const response = await axios.get<ToDo[]>('http://localhost:8080/todo/lists')
  return response.data
}

export const postTodo = async (content: string) => {
  const response = await axios.post('http://localhost:8080/todo/create', { content })
  return response.data
}

export const patchTodoCheck = async (id: number, isChecked: 0 | 1) => {
  const response = await axios.patch(`http://localhost:8080/todo/update/${id}`, { isChecked })
  return response.data
}

export const deleteTodo = async (id: number) => {
  const response = await axios.delete(`http://localhost:8080/todo/delete/${id}`)
  return response.data
}
