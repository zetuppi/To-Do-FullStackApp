import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask, TaskCategory, TaskPriority } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskList from '@/components/TaskList';
import TaskDialog from '@/components/TaskDialog';
import FilterBar from '@/components/FilterBar';

type FilterType = 'todas' | 'pendentes' | 'concluidas';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTask();
  const navigate = useNavigate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('todas');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'todas'>('todas');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'todas'>('todas');

  // Função para lidar com o logout do usuário
  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    navigate('/auth'); // Redireciona para a página de autenticação
  };

  // Memoização das tarefas filtradas baseada nos filtros aplicados
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Verifica se o status da tarefa corresponde ao filtro
      const statusMatch = filter === 'todas' ||
        (filter === 'pendentes' && !task.completed) ||
        (filter === 'concluidas' && task.completed);

      // Verifica se a categoria da tarefa corresponde ao filtro
      const categoryMatch = categoryFilter === 'todas' || task.category === categoryFilter;
      // Verifica se a prioridade da tarefa corresponde ao filtro
      const priorityMatch = priorityFilter === 'todas' || task.priority === priorityFilter;

      // Retorna true apenas se todos os filtros corresponderem
      return statusMatch && categoryMatch && priorityMatch;
    });
  }, [tasks, filter, categoryFilter, priorityFilter]); // Dependências para recalcular quando mudam

  // Memoização das estatísticas das tarefas
  const stats = useMemo(() => {
    const total = tasks.length; // Número total de tarefas
    const completed = tasks.filter(t => t.completed).length; // Número de tarefas concluídas
    const pending = total - completed; // Número de tarefas pendentes

    return { total, completed, pending }; // Retorna objeto com as estatísticas
  }, [tasks]); // Recalcula quando a lista de tarefas muda

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-ocean p-2 rounded-lg">
                <CheckSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">TodoApp</h1>
                <p className="text-sm text-muted-foreground">Olá, {user?.name}!</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-xl shadow-md border">
            <p className="text-sm text-muted-foreground mb-1">Total de Tarefas</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-md border">
            <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-accent">{stats.pending}</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-md border">
            <p className="text-sm text-muted-foreground mb-1">Concluídas</p>
            <p className="text-3xl font-bold text-success">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Minhas Tarefas</h2>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-ocean">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>

          <FilterBar
            filter={filter}
            setFilter={setFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />

          <TaskList tasks={filteredTasks} />
        </div>
      </main>

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Dashboard;
