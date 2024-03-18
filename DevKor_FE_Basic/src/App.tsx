import TodoItem from '@/components/custom/ToDoItem'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { TODO_LIST, generateRandomContents } from '@/data/todoList'
import ProgressBar from '@/components/custom/ProgressBar'
import InputContainer from '@/components/custom/InputContainer'
function App() {
  //? 게으른 초기화를 사용하여 초기 상태를 설정합니다.
  const [todoList, setTodoList] = useState(() => generateRandomContents(10000))
  const [placeholderText, setPlaceholderText] = useState('할 일을 작성해보세요!')
  const [borderColor, setBorderColor] = useState('#DADADA')
  const [newTodo, setNewTodo] = useState('')

  const progress =
    todoList.length > 0 ? Math.floor((todoList.filter(todo => todo.isChecked).length / todoList.length) * 100) : 0

  const handleAddTodo = useCallback(() => {
    if (newTodo === '') {
      setPlaceholderText('일을 작성해야합니다!!!')
      setBorderColor('#FF5F57')
      return
    }
    setTodoList(prev => [...prev, { id: prev.length, content: newTodo, isChecked: false }])
    setNewTodo('')
    setPlaceholderText('할 일을 작성해보세요!')
    setBorderColor('#DADADA')
  }, [newTodo])
  const handleCheck = useCallback((id: number) => {
    setTodoList(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, isChecked: todo.isChecked ? false : true } : todo))
    )
  }, [])

  const handleDelete = useCallback((id: number) => {
    setTodoList(prev => prev.filter(todo => todo.id !== id))
  }, [])

  console.log('App render')

  setTimeout(() => console.log('setTimeout'), 0)
  Promise.resolve().then(() => console.log('Promise.resolve().then()'))
  useLayoutEffect(() => {
    console.log('App useLayoutEffect')
    return () => {
      console.log('App useLayoutEffect cleanup')
    }
  }, [todoList])
  useEffect(() => {
    console.log('App useEffect')

    return () => {
      console.log('App useEffect cleanup')
    }
  }, [todoList])

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="flex flex-col items-center justify-center mb-20">
        <h1 className="text-5xl font-bold">🎊 DevKor React Basic !! 🎊</h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-[20px]">
        <div className="flex w-[393px] justify-center items-center rounded-[10px] shadow border py-[15px]">
          <h4 className="text-xl font-bold">TODO LIST</h4>
        </div>
        <ProgressBar progress={progress} />
        <InputContainer
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          placeholderText={placeholderText}
          borderColor={borderColor}
          handleAddTodo={handleAddTodo}
        />
        {/* <div className="flex flex-row gap-[20px] w-[393px]">
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
        </div> */}
      </div>
      <div className="flex flex-col justify-center items-center gap-[10px] mt-[20px]">
        {todoList.map(todo => (
          <TodoItem
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
