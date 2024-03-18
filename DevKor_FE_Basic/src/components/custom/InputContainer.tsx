import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { memo } from 'react'

interface InputContainerProps {
  newTodo: string
  setNewTodo: React.Dispatch<React.SetStateAction<string>>
  placeholderText: string
  borderColor: string
  handleAddTodo: () => void
}
const InputContainer = memo(
  ({ newTodo, setNewTodo, placeholderText, borderColor, handleAddTodo }: InputContainerProps) => {
    return (
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
    )
  }
)

export default InputContainer
