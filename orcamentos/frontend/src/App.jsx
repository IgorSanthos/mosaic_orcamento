// App.jsx - Rotas com React Router DOM v7

import {
  RouterProvider,
  createBrowserRouter,
  Link,
  Outlet,
} from "react-router-dom";

import CreateEstimate from "./pages/CreateEstimate";
import ListEstimates from "./pages/ListEstimates";
import ViewEstimate from "./pages/ViewEstimate";

// Estilos precisam ficar ANTES do router
const navStyle = {
  background: "#1a73e8",
  padding: "12px 20px",
  marginBottom: "20px",
  display: "flex",
  gap: "20px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
};

// 1. Criamos um componente para o Layout da Rota Raiz
function RootLayout() {
  return (
    <>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Criar Orçamento</Link>
        <Link to="/orcamentos" style={linkStyle}>Lista de Orçamentos</Link>
      </nav>
      {/* 2. O Outlet renderiza a rota filha correspondente */}
      <Outlet />
    </>
  );
}

// 3. Reestruturamos as rotas para usar o layout aninhado
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // A rota pai renderiza o layout
    children: [ // As rotas filhas são renderizadas dentro do <Outlet />
      {
        index: true, // Esta é a rota padrão para "/"
        element: <CreateEstimate />,
      },
      {
        path: "/orcamentos",
        element: <ListEstimates />,
      },
      {
        path: "/orcamentos/:id",
        element: <ViewEstimate />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
