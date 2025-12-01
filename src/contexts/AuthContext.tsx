import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Componente provedor que fornece o contexto de autenticação para toda a aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado para armazenar o usuário logado
  const [user, setUser] = useState<User | null>(null);
  // Estado para indicar se está carregando dados iniciais
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar usuário salvo no localStorage quando o componente monta
  useEffect(() => {
    const storedUser = localStorage.getItem('todoapp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Define o usuário se encontrado no localStorage
    }
    setIsLoading(false); // Finaliza o carregamento
  }, []);

  // Função assíncrona para registrar um novo usuário
  const register = async (email: string, password: string, name: string) => {
    // Busca a lista de usuários existentes no localStorage
    const users = JSON.parse(localStorage.getItem('todoapp_users') || '[]');

    // Verifica se o email já está cadastrado
    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: 'Email já cadastrado' }; // Retorna erro se email já existe
    }

    // Cria um novo usuário com os dados fornecidos
    const newUser = {
      id: Date.now().toString(), // Gera ID único baseado no timestamp
      email,
      password,
      name,
    };

    users.push(newUser); // Adiciona o novo usuário à lista
    localStorage.setItem('todoapp_users', JSON.stringify(users)); // Salva a lista atualizada no localStorage

    // Cria versão do usuário sem senha para armazenar no estado
    const userWithoutPassword = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userWithoutPassword); // Define o usuário logado
    localStorage.setItem('todoapp_user', JSON.stringify(userWithoutPassword)); // Salva no localStorage

    return { success: true }; // Retorna sucesso
  };

  // Função assíncrona para fazer login do usuário
  const login = async (email: string, password: string) => {
    // Busca a lista de usuários no localStorage
    const users = JSON.parse(localStorage.getItem('todoapp_users') || '[]');
    // Procura o usuário com email e senha correspondentes
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    // Se não encontrar o usuário, retorna erro
    if (!foundUser) {
      return { success: false, error: 'Email ou senha incorretos' };
    }

    // Cria versão do usuário sem senha para armazenar no estado
    const userWithoutPassword = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
    setUser(userWithoutPassword); // Define o usuário logado
    localStorage.setItem('todoapp_user', JSON.stringify(userWithoutPassword)); // Salva no localStorage

    return { success: true }; // Retorna sucesso
  };

  // Função para fazer logout do usuário
  const logout = () => {
    setUser(null); // Remove o usuário do estado
    localStorage.removeItem('todoapp_user'); // Remove o usuário do localStorage
  };

  // Retorna o provedor de contexto com os valores disponíveis para os componentes filhos
  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children} {/* Renderiza os componentes filhos dentro do contexto */}
    </AuthContext.Provider>
  );
};
