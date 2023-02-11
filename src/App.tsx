import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Construtoras from "./pages/Construtoras/Construtoras";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import ConstrutorasSingle from "./pages/ConstrutorasSingle/ConstrutorasSingle";
import Empreendimentos from "./pages/Empreendimentos/Empreendimentos";
import EmpreendimentosSingle from "./pages/EmpreendimentosSingle/EmpreendimentosSingle";
import EmpreendimentosCadastro from "./pages/EmpreendimentosCadastro/EmpreendimentosCadastro";
import DownloadFileRoute from "./pages/DownloadPage";
import Arquivos from "./pages/Arquivos/Arquivos";
import CreateQrCode from "./pages/Qrcode/CreateQrCode";
import ViewQrCode from "./pages/Qrcode/ViewQrCode";
import EditQrCode from "./pages/Qrcode/EditQrCode";
import Home from "./pages/Home/Home";
import { LayoutContextProvider } from "./context/LayoutContext";
import { ApiContextBuilder } from "./context/ApiContext";
import "./app.scss";
import { ToastContainer } from "react-toastify";
import ConstrutorasNew from "./pages/ConstrutorasNew/ConstrutorasNew";
import Unidades from "./pages/Unidades/Unidades";
import UnidadesForm from "./pages/Unidades/UnidadesForm";
import UnidadeView from "./pages/Unidades/UnidadeView";

function App() {
  return (
    <LayoutContextProvider>
      <ApiContextBuilder>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/qrcode/:id" element={<DownloadFileRoute />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Home />} />
              <Route path="construtoras">
                <Route index element={<Construtoras />} />
                <Route path="novo" element={<ConstrutorasNew />} />
                <Route path=":id" element={<ConstrutorasSingle />} />
              </Route>
              <Route path="empreendimentos">
                <Route index element={<Empreendimentos />} />
                <Route path="cadastro" element={<EmpreendimentosCadastro />} />
                <Route path="cadastro/:id" element={<EmpreendimentosCadastro />} />
                <Route
                  path=":idEmpreendimento"
                  element={<EmpreendimentosSingle />}
                />
              </Route>
              <Route path="unidades">
                <Route index element={<Unidades />} />
                <Route path="novo" element={<UnidadesForm />} />
                <Route path=":id" element={<UnidadeView />} />
              </Route>
              <Route path="arquivos" >
                <Route index element={<Arquivos />} />
              </Route>
              <Route path="qrcode">
                <Route index element={<ViewQrCode />} />
                <Route path="novo" element={<CreateQrCode />} />
                <Route path=":id" element={<EditQrCode />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ApiContextBuilder>
    </LayoutContextProvider >
  );
}

export default App;
