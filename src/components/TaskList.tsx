import { Task } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
        <p className="text-sm text-muted-foreground mt-2">
          Crie sua primeira tarefa para começar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
