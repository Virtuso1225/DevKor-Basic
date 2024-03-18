export interface ToDo {
  id: number
  content: string
  isChecked: true | false
}
export interface ToDoContainerProps extends ToDo {
  handlCheck: (id: number) => void
  handleDelete: (id: number) => void
}
