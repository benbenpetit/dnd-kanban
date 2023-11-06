import { FC, useState } from 'react'
import { ITask } from '../types/Kanban'

interface Props {
  task: ITask
  setTaskTitle: (id: string, title: string) => void
  setTaskDescription: (id: string, description: string) => void
  leaveModal: () => void
}

const Modal: FC<Props> = ({
  task,
  setTaskTitle,
  setTaskDescription,
  leaveModal
}) => {
  const [currentColorIndex, setCurrentColorIndex] = useState<number>(0)
  const COLORS = ['#e06060', '#b69500', '#00b0a7', '#606fe0', '#e060d9']

  const changeColor = () => {
    setCurrentColorIndex(currentColorIndex + 1)
  }

  return (
    <div className='modal'>
      <span className='backdrop' onClick={leaveModal} />
      <div className='inside'>
        <header>
          <span
            className='status'
            style={{
              backgroundColor: COLORS[currentColorIndex % COLORS.length]
            }}
            onClick={() => changeColor()}
          />
          <input
            value={task.title}
            onChange={(e) => setTaskTitle(task.id, e.target.value)}
          />
        </header>
        <div className='content'>
          <textarea
            onChange={(e) => setTaskDescription(task.id, e.target.value)}
          >
            {task.description}
          </textarea>
        </div>
      </div>
    </div>
  )
}

export default Modal
