// Importações necessárias para inicializar a aplicação React
import { createRoot } from "react-dom/client"; // Função para criar a raiz do React
import App from "./App.tsx"; // Componente principal da aplicação
import "./index.css"; // Estilos globais da aplicação

// Cria a raiz do React no elemento HTML com id "root" e renderiza o componente App
createRoot(document.getElementById("root")!).render(<App />);
