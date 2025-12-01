import { TaskCategory, TaskPriority } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

type FilterType = 'todas' | 'pendentes' | 'concluidas';

interface FilterBarProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  categoryFilter: TaskCategory | 'todas';
  setCategoryFilter: (category: TaskCategory | 'todas') => void;
  priorityFilter: TaskPriority | 'todas';
  setPriorityFilter: (priority: TaskPriority | 'todas') => void;
}

const FilterBar = ({
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'todas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('todas')}
          className={filter === 'todas' ? 'bg-gradient-ocean' : ''}
        >
          <ListTodo className="w-4 h-4 mr-2" />
          Todas
        </Button>
        <Button
          variant={filter === 'pendentes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pendentes')}
          className={filter === 'pendentes' ? 'bg-gradient-coral' : ''}
        >
          <Circle className="w-4 h-4 mr-2" />
          Pendentes
        </Button>
        <Button
          variant={filter === 'concluidas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('concluidas')}
          className={filter === 'concluidas' ? 'bg-success' : ''}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Concluídas
        </Button>
      </div>

      <div className="flex gap-2 flex-1">
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as TaskCategory | 'todas')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas Categorias</SelectItem>
            <SelectItem value="trabalho">Trabalho</SelectItem>
            <SelectItem value="pessoal">Pessoal</SelectItem>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="estudos">Estudos</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'todas')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas Prioridades</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
