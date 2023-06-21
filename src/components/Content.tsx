import { PlusCircle } from 'phosphor-react';
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TaskEmpty } from './TaskEmpty';
import { Tasks } from './Tasks';

import styles from './Content.module.css';

interface TaskList {
    id: string,
    message: string,
    status: number
}

export function Content() {
    const [tasks, setTasks] = useState<TaskList[]>([]);
    const [taskMessage, setTaskMessage] = useState('');
    const [countTasks, setCountTasks] = useState(0);

    function handleCreateTask(event: FormEvent) {
        event.preventDefault();

        setTasks([...tasks, {
            id: uuidv4(),
            message: taskMessage,
            status: 0
        }].sort((first, second) => first.status - second.status));

        setTaskMessage('');

        setCountTasks((count) => count + 1);
    }

    function handleNewTaskEmpty(event: InvalidEvent<HTMLInputElement>) {
        event.target.setCustomValidity(
            'Este campo é obrigatório. Preencha para cadastrar nova tarefea!'
        );
    }

    function handleNewTaskMessage(event: ChangeEvent<HTMLInputElement>) {
        event.target.setCustomValidity('');
        setTaskMessage(event.target.value);
    }

    function deleteTask(id: string) {
        const newTaskWithoutIdDeleted = tasks.filter(task => task.id !== id);

        setTasks(newTaskWithoutIdDeleted);
        setCountTasks(newTaskWithoutIdDeleted.length);
    }

    function changeStatusTask(id: string) {
        const newTasksChangedStatus = tasks.reduce((allTasks: TaskList[], task) => {
            if (task.id === id) {
                if (!task.status) {
                    task.status = 1;
                } else {
                    task.status = 0;
                }
            }
            allTasks.push(task);

            return allTasks;
        }, []).sort((first, second) => first.status - second.status);

        setTasks(newTasksChangedStatus);
    }

    const taskIsComplete = tasks.reduce((allTasks, task) => {
        if (task.status) {
            allTasks++;
        }

        return allTasks;
    }, 0);

    return (
        <main className={styles.content}>
            <form onSubmit={handleCreateTask}>
                <input
                    type="text"
                    value={taskMessage}
                    onChange={handleNewTaskMessage}
                    onInvalid={handleNewTaskEmpty}
                    placeholder='Adicione uma nova tarefa'
                    autoFocus
                    required
                />
                <button>
                    Criar
                    <PlusCircle size={18} />
                </button>
            </form>

            <section className={styles.taskBox}>
                <div className={styles.taskInfo}>
                    <div>
                        Tarefas criadas
                        <span>{countTasks}</span>
                    </div>
                    <div>
                        Concluídas
                        <span>
                            {countTasks > 0
                                ? `${taskIsComplete} de ${countTasks}`
                                : countTasks}
                        </span>
                    </div>
                </div>

                {countTasks === 0
                    ? <TaskEmpty />
                    : tasks.map(task =>
                        <Tasks
                            key={task.id}
                            id={task.id}
                            message={task.message}
                            status={task.status}
                            onChangeStatusTask={changeStatusTask}
                            onDeleteTask={deleteTask}
                        />
                    )
                }
            </section>
        </main>
    )
}