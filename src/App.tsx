import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LayoutContextProvider } from "./context/LayoutContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Construtoras from "./pages/Construtoras/Construtoras";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import "./app.scss";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Single from "./pages/Single";
import ConstrutorasSingle from "./pages/ConstrutorasSingle/ConstrutorasSingle";
import List from "./pages/List";
import Empreendimentos from "./pages/Empreendimentos/Empreendimentos";
import EmpreendimentosSingle from "./pages/EmpreendimentosSingle/EmpreendimentosSingle";
import EmpreendimentosCadastro from "./pages/EmpreendimentosCadastro/EmpreendimentosCadastro";
import DownloadFileRoute from "./utils/DownloadFileRoute";
import Arquivos from "./pages/Arquivos/Arquivos";

function App() {
  return (
    <LayoutContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/download/id=:id&hash=:hash"
          element={<DownloadFileRoute />}
        />
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Home />} />
            <Route path="construtoras">
              <Route index element={<Construtoras />} />
              <Route path=":id" element={<ConstrutorasSingle />} />
            </Route>
            <Route path="empreendimentos">
              <Route index element={<Empreendimentos />} />
              <Route path="cadastro" element={<EmpreendimentosCadastro />} />
              <Route
                path=":idEmpreendimento"
                element={<EmpreendimentosSingle />}
              />
            </Route>
            <Route path="arquivos" element={<Arquivos />} />
          </Route>
        </Route>
      </Routes>
    </LayoutContextProvider>
  );
}

export default App;
