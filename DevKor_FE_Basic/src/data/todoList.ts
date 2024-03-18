import type { ToDo } from '@/models/todo'

export const TODO_LIST: ToDo[] = [
  { id: 0, content: '리액트 공부하기', isChecked: false },
  { id: 1, content: '타입스크립트 공부하기', isChecked: false },
  { id: 2, content: '실습하기', isChecked: false },
  { id: 3, content: '🏡 가고 싶다', isChecked: false }
]

export const generateRandomContents = (count: number) => {
  console.log('generateRandomContents')
  const contents: ToDo[] = []
  const emojis = ['🏡', '🍎', '📚', '✈', '⚽', '🎨', '🚗', '🎉', '🍕', '🎸'] // 미리 정의된 이모지 배열

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * emojis.length)
    const content = `${emojis[randomIndex]} 가고 싶다` // 이모지와 함께 내용 생성
    contents.push({ id: i, content, isChecked: false })
  }

  return contents
}
