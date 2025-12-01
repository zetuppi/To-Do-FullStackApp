import { useState } from 'react';
import { Task, useTask } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Briefcase, User, Heart, GraduationCap } from 'lucide-react';
import TaskDialog from './TaskDialog';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTask, deleteTask } = useTask();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const categoryIcons = {
    trabalho: Briefcase,
    pessoal: User,
    saude: Heart,
    estudos: GraduationCap,
  };

  const categoryColors = {
    trabalho: 'bg-primary/10 text-primary',
    pessoal: 'bg-accent/10 text-accent',
    saude: 'bg-success/10 text-success',
    estudos: 'bg-destructive/10 text-destructive',
  };

  const priorityColors = {
    alta: 'bg-destructive text-destructive-foreground',
    media: 'bg-accent text-accent-foreground',
    baixa: 'bg-muted text-muted-foreground',
  };

  const CategoryIcon = categoryIcons[task.category];

  return (
    <>
      <div className={cn(
        "flex items-start gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md",
        task.completed && "opacity-60 task-complete"
      )}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          className="mt-1"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className={cn(
              "font-medium text-foreground",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className={cn(
              "text-sm text-muted-foreground mb-3",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={categoryColors[task.category]}>
              <CategoryIcon className="w-3 h-3 mr-1" />
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </Badge>
            <Badge className={priorityColors[task.priority]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditOpen(true)}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTask(task.id)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <TaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={task}
      />
    </>
  );
};

export default TaskItem;
