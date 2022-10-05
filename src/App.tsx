import { Routes, Route } from "react-router-dom";
import { LayoutContextProvider } from "./context/LayoutContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Construtoras from "./pages/Construtoras/Construtoras";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import ConstrutorasSingle from "./pages/ConstrutorasSingle/ConstrutorasSingle";
import Empreendimentos from "./pages/Empreendimentos/Empreendimentos";
import EmpreendimentosSingle from "./pages/EmpreendimentosSingle/EmpreendimentosSingle";
import EmpreendimentosCadastro from "./pages/EmpreendimentosCadastro/EmpreendimentosCadastro";
import DownloadFileRoute from "./utils/DownloadFileRoute";
import Arquivos from "./pages/Arquivos/Arquivos";
import CreateQrCode from "./pages/Qrcode/CreateQrCode";
import ViewQrCode from "./pages/Qrcode/ViewQrCode";
import EditQrCode from "./pages/Qrcode/EditQrCode";
import "./app.scss";
import New from "./pages/New";

function App() {
  return (
    <LayoutContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/qrcode">
          <Route path=":id" element={<DownloadFileRoute />} />
        </Route>
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
