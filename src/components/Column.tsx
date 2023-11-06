import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FC, useMemo } from 'react'
import { IColumn, ITask } from '../types/Kanban'
import Task from './Task'

interface Props {
  column: IColumn
  tasks: ITask[]
  deleteColumn: (id: string) => void
  setColumnTitle: (id: string, title: string) => void
  createTask: (title: string) => void
  deleteTask: (id: string) => void
  openTask: (id: string) => void
}

const Column: FC<Props> = ({
  column,
  tasks,
  deleteColumn,
  setColumnTitle,
  createTask,
  deleteTask,
  openTask
}) => {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging) {
    return (
      <div
        className='column is-grabbing'
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    )
  }

  return (
    <div
      className='column'
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className='header'>
        <input
          value={column.title}
          onChange={(e) => setColumnTitle(column.id, e.target.value)}
        />
        <button onClick={() => deleteColumn(column.id)}>
          <svg
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
            />
          </svg>
        </button>
      </div>
      <div className='content'>
        <div className='tasks custom-scrollbar'>
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                openTask={openTask}
              />
            ))}
          </SortableContext>
        </div>
        <button onClick={() => createTask('New task')}>
          <svg
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>Add task</span>
        </button>
      </div>
    </div>
  )
}

export default Column
