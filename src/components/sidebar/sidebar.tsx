import { Link } from "react-router-dom";
import "./sidebar.scss";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { QrCode2Rounded } from "@mui/icons-material";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/admin" style={{ textDecoration: "none" }}>
          <span className="logo">triscoadmin</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="subtitle">Página Principal</p>
          <li>
            <Link to="/manual" style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <p className="subtitle">Cadastros</p>
          <li className="menu_links">
            <Link to="./construtoras" style={{ textDecoration: "none" }}>
              <AddBusinessRoundedIcon className="icon" />
              <span>Construtoras</span>
            </Link>
          </li>
          <li>
            <Link to="./empreendimentos" style={{ textDecoration: "none" }}>
              <ApartmentRoundedIcon className="icon" />
              <span>Empreendimentos</span>
            </Link>
          </li>
          <li>
            <Link to="./arquivos" style={{ textDecoration: "none" }}>
              <FilePresentRoundedIcon className="icon" />
              <span>Arquivos</span>
            </Link>
          </li>
          <li>
            <Link to="./qrcode" style={{ textDecoration: "none" }}>
              <QrCode2Rounded className="icon" />
              <span>QR Codes</span>
            </Link>
          </li>
          <p className="subtitle">Admin</p>
          <li>
            <Link to="./usuarios" style={{ textDecoration: "none" }}>
              <ManageAccountsRoundedIcon className="icon" />
              <span>Usuários</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* <div className="bottom">color opt</div> */}
    </div>
  );
};

export default Sidebar;
