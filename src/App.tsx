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
import CreateQrCode from "./pages/Qrcode/CreateQrCode";
import ViewQrCode from "./pages/Qrcode/ViewQrCode";
import EditQrCode from "./pages/Qrcode/EditQrCode";

function App() {
  return (
    <LayoutContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/download/id=:id"
          element={<DownloadFileRoute />}
        />
        <Route element={<ProtectedRoutes />}>
          <Route path="/manual" element={<AdminLayout />}>
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
            <Route path="qrcode">
              <Route index element={<ViewQrCode />} />
              <Route path="novo" element={<CreateQrCode />} />
              <Route path=":id" element={<EditQrCode />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </LayoutContextProvider>
  );
}

export default App;
