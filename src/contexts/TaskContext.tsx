import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type TaskPriority = 'alta' | 'media' | 'baixa';
export type TaskCategory = 'trabalho' | 'pessoal' | 'saude' | 'estudos';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: string;
  userId: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};

// Componente provedor que fornece o contexto de tarefas para toda a aplicação
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Obtém o usuário logado do contexto de autenticação
  const [tasks, setTasks] = useState<Task[]>([]); // Estado para armazenar a lista de tarefas

  // Efeito para carregar tarefas do localStorage quando o usuário muda
  useEffect(() => {
    if (user) {
      // Busca tarefas salvas no localStorage para o usuário atual
      const storedTasks = localStorage.getItem(`todoapp_tasks_${user.id}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks)); // Define as tarefas encontradas
      } else {
        setTasks([]); // Define lista vazia se não houver tarefas salvas
      }
    } else {
      setTasks([]); // Limpa as tarefas se não houver usuário logado
    }
  }, [user]); // Executa sempre que o usuário muda

  // Função auxiliar para salvar tarefas no localStorage e atualizar o estado
  const saveTasks = (newTasks: Task[]) => {
    if (user) {
      localStorage.setItem(`todoapp_tasks_${user.id}`, JSON.stringify(newTasks)); // Salva no localStorage
      setTasks(newTasks); // Atualiza o estado
    }
  };

  // Função para adicionar uma nova tarefa
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return; // Se não houver usuário logado, não faz nada

    // Cria uma nova tarefa com os dados fornecidos mais os campos gerados automaticamente
    const newTask: Task = {
      ...task, // Copia os dados da tarefa fornecida
      id: Date.now().toString(), // Gera um ID único baseado no timestamp
      createdAt: new Date().toISOString(), // Define a data de criação como ISO string
      userId: user.id, // Associa a tarefa ao usuário logado
    };

    saveTasks([...tasks, newTask]); // Salva a nova lista de tarefas incluindo a nova tarefa
  };

  // Função para atualizar uma tarefa existente
  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    // Mapeia as tarefas, atualizando apenas a tarefa com o ID correspondente
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updatedTask } : task // Mescla os dados atualizados na tarefa encontrada
    );
    saveTasks(newTasks); // Salva a lista atualizada
  };

  // Função para deletar uma tarefa
  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(task => task.id !== id)); // Filtra e salva apenas as tarefas que não têm o ID especificado
  };

  // Função para alternar o status de conclusão de uma tarefa
  const toggleTask = (id: string) => {
    // Mapeia as tarefas, invertendo o status 'completed' da tarefa com o ID correspondente
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task // Inverte o valor de 'completed'
    );
    saveTasks(newTasks); // Salva a lista atualizada
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTask }}>
      {children}
    </TaskContext.Provider>
  );
};
