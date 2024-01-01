import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import ToDo from '@/components/custom/ToDoItem'
import { useState } from 'react'
import { TODO_LIST } from '@/data/todoList'
function App() {
  const [todoList, setTodoList] = useState(TODO_LIST)
  const [placeholderText, setPlaceholderText] = useState('할 일을 작성해보세요!')
  const [borderColor, setBorderColor] = useState('#DADADA')
  const [newTodo, setNewTodo] = useState('')

  const progress =
    todoList.length > 0 ? Math.floor((todoList.filter(todo => todo.isChecked).length / todoList.length) * 100) : 0

  const handleAddTodo = () => {
    if (newTodo === '') {
      setPlaceholderText('일을 작성해야합니다!!!')
      setBorderColor('#FF5F57')
      return
    }
    setTodoList(prev => [...prev, { id: prev.length, content: newTodo, isChecked: false }])
    setNewTodo('')
    setPlaceholderText('할 일을 작성해보세요!')
    setBorderColor('#DADADA')
  }
  const handleCheck = (id: number) => {
    setTodoList(prev => prev.map(todo => (todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo)))
  }

  const handleDelete = (id: number) => {
    setTodoList(prev => prev.filter(todo => todo.id !== id))
  }
  return (
    <div className="flex flex-col justify-center items-center p-20">
      <div className="flex flex-col justify-center items-center mb-20">
        <h1 className="text-5xl font-bold">🎊 DevKor React Basic !! 🎊</h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-[20px]">
        <div className="flex w-[393px] justify-center items-center rounded-[10px] shadow border py-[15px]">
          <h4 className="text-xl font-bold">TODO LIST</h4>
        </div>
        <div className="flex flex-row w-[393px] justify-center items-center gap-[20px]">
          <Progress value={progress} className="flex" />
          <p className="text-[15px] font-semibold	">{progress}%</p>
        </div>
        <div className="flex flex-row gap-[20px] w-[393px]">
          <Input
            className={`flex self-stretch justify-center items-center rounded-[10px] shadow border border-[${borderColor}]`}
            type="text"
            placeholder={placeholderText}
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.nativeEvent.isComposing === false && e.key === 'Enter' && handleAddTodo()}
          />
          <Button
            className="flex w-[100px] justify-center items-center rounded-[10px]"
            type="button"
            onClick={handleAddTodo}
          >
            추가하기
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-[10px] mt-[20px]">
        {todoList.map(todo => (
          <ToDo
            key={todo.id}
            id={todo.id}
            isChecked={todo.isChecked}
            content={todo.content}
            handlCheck={handleCheck}
            handleDelete={handleDelete}
          />
        ))}
        {/* {todoList.map(todo =>
          todo.isChecked ? (
            <ToDo
              key={todo.id}
              id={todo.id}
              isChecked={todo.isChecked}
              content={todo.content}
              handlCheck={handleCheck}
              handleDelete={handleDelete}
            />
          ) : (
            ''
          )
        )} */}
      </div>
    </div>
  )
}

export default App
