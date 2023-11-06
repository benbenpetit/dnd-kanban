import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { IColumn, ITask } from '../types/Kanban'
import Column from './Column'
import Modal from './Modal'
import Task from './Task'

const getRandomId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const DEFAULT_COLUMNS: IColumn[] = [
  {
    id: getRandomId(),
    title: 'To do'
  },
  {
    id: getRandomId(),
    title: 'In progress'
  },
  {
    id: getRandomId(),
    title: 'Code review'
  }
]

const DEFAULT_TASKS: ITask[] = [
  {
    id: getRandomId(),
    title: 'Task 1',
    columnId: DEFAULT_COLUMNS[0].id,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, voluptas.\n\nAccusamus illo quas quasi, animi dolor praesentium officiis reprehenderit asperiores tempore exercitationem! Cum beatae accusamus illo veniam laborum, eligendi ratione, saepe id accusantium esse officiis, quidem sit dolore aperiam. Inventore voluptate ullam modi. Aliquam?`
  },
  {
    id: getRandomId(),
    title: 'Task 2',
    columnId: DEFAULT_COLUMNS[0].id,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, voluptas.\n\nAccusamus illo quas quasi, animi dolor praesentium officiis reprehenderit asperiores tempore exercitationem! Cum beatae accusamus illo veniam laborum, eligendi ratione, saepe id accusantium esse officiis, quidem sit dolore aperiam. Inventore voluptate ullam modi. Aliquam?`
  },
  {
    id: getRandomId(),
    title: 'Task 3',
    columnId: DEFAULT_COLUMNS[0].id,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, voluptas.\n\nAccusamus illo quas quasi, animi dolor praesentium officiis reprehenderit asperiores tempore exercitationem! Cum beatae accusamus illo veniam laborum, eligendi ratione, saepe id accusantium esse officiis, quidem sit dolore aperiam. Inventore voluptate ullam modi. Aliquam?`
  },
  {
    id: getRandomId(),
    title: 'Task 4',
    columnId: DEFAULT_COLUMNS[1].id,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, voluptas.\n\nAccusamus illo quas quasi, animi dolor praesentium officiis reprehenderit asperiores tempore exercitationem! Cum beatae accusamus illo veniam laborum, eligendi ratione, saepe id accusantium esse officiis, quidem sit dolore aperiam. Inventore voluptate ullam modi. Aliquam?`
  },
  {
    id: getRandomId(),
    title: 'Task 5',
    columnId: DEFAULT_COLUMNS[2].id,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, voluptas.\n\nAccusamus illo quas quasi, animi dolor praesentium officiis reprehenderit asperiores tempore exercitationem! Cum beatae accusamus illo veniam laborum, eligendi ratione, saepe id accusantium esse officiis, quidem sit dolore aperiam. Inventore voluptate ullam modi. Aliquam?`
  },
  {
    id: getRandomId(),
    title: 'Task 6',
    columnId: DEFAULT_COLUMNS[2].id,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, voluptas.\n\nAccusamus illo quas quasi, animi dolor praesentium officiis reprehenderit asperiores tempore exercitationem! Cum beatae accusamus illo veniam laborum, eligendi ratione, saepe id accusantium esse officiis, quidem sit dolore aperiam. Inventore voluptate ullam modi. Aliquam?`
  }
]

const KanbanBoard = () => {
  const [columns, setColumns] = useState<IColumn[]>(DEFAULT_COLUMNS)
  const [tasks, setTasks] = useState<ITask[]>(DEFAULT_TASKS)
  const columnsIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  )
  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
  const [activeTask, setActiveTask] = useState<ITask | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    })
  )

  const addColumn = (title: string) => {
    setColumns([
      ...columns,
      {
        id: getRandomId(),
        title
      }
    ])
  }

  const deleteColumn = (id: string) => {
    setColumns(columns.filter((column) => column.id !== id))
    setTasks(tasks.filter((task) => task.columnId !== id))
  }

  const setColumnTitle = (id: string, title: string) => {
    setColumns(
      columns.map((column) => {
        if (column.id === id) {
          return {
            ...column,
            title
          }
        }

        return column
      })
    )
  }

  const createTask = (columnId: string, title: string) => {
    setTasks([
      ...tasks,
      {
        id: getRandomId(),
        title,
        columnId,
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, voluptas.\n\nAccusamus illo quas quasi, animi dolor praesentium officiis reprehenderit asperiores tempore exercitationem! Cum beatae accusamus illo veniam laborum, eligendi ratione, saepe id accusantium esse officiis, quidem sit dolore aperiam. Inventore voluptate ullam modi. Aliquam?`
      }
    ])
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (!taskToDelete) return

    setTasks(tasks.filter((task) => task.id !== id))
  }

  const openTask = (id: string) => {
    const taskToOpen = tasks.find((task) => task.id === id)
    if (!taskToOpen) return

    setActiveTask(taskToOpen)
    setIsTaskModalOpen(true)
  }

  const setTaskTitle = (id: string, title: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title
          }
        }

        return task
      })
    )
  }

  const setTaskDescription = (id: string, description: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            description
          }
        }

        return task
      })
    )
  }

  const onDragStart = (event: DragStartEvent) => {
    setActiveColumn(null)
    setActiveTask(null)

    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column)
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task)
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeColumnId = active.id
    const overColumnId = over.id

    if (activeColumnId === overColumnId) return

    const isActiveAColumn = active.data.current?.type === 'Column'
    if (!isActiveAColumn) return

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      )
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      )

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === 'Task'
    const isOverATask = over.data.current?.type === 'Task'

    if (!isActiveATask) return

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        tasks[activeIndex].columnId = overId as string
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }

  return (
    <div className='kanban-board'>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className='columns'>
          <SortableContext items={columnsIds}>
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.columnId === column.id)}
                deleteColumn={(id) => deleteColumn(id)}
                setColumnTitle={(id, title) => setColumnTitle(id, title)}
                createTask={(title) => createTask(column.id, title)}
                deleteTask={(id) => deleteTask(id)}
                openTask={(id) => openTask(id)}
              />
            ))}
          </SortableContext>
          <button onClick={() => addColumn(`Column ${columns.length + 1}`)}>
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
            <span>Add column</span>
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteColumn={() => deleteColumn(activeColumn.id)}
                setColumnTitle={(title) =>
                  setColumnTitle(activeColumn.id, title)
                }
                createTask={(title) => createTask(activeColumn.id, title)}
                deleteTask={(id) => deleteTask(id)}
                openTask={(id) => openTask(id)}
              />
            )}
            {activeTask && (
              <Task
                task={activeTask}
                deleteTask={() => deleteTask(activeTask.id)}
                openTask={() => openTask(activeTask.id)}
              />
            )}
          </DragOverlay>,
          document.body
        )}
        {createPortal(
          <>
            {isTaskModalOpen && activeTask && (
              <Modal
                task={
                  tasks.find((task) => task.id === activeTask.id) || activeTask
                }
                setTaskTitle={(id, title) => setTaskTitle(id, title)}
                setTaskDescription={(id, description) =>
                  setTaskDescription(id, description)
                }
                leaveModal={() => setIsTaskModalOpen(false)}
              />
            )}
          </>,
          document.body
        )}
      </DndContext>
    </div>
  )
}

export default KanbanBoard
