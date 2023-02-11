import { Link } from "react-router-dom";
import "./sidebar.scss";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import HolidayVillageRoundedIcon from '@mui/icons-material/HolidayVillageRounded';
import { FileCopy, QrCode2Rounded } from "@mui/icons-material";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/admin" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img src="/images/logo-trisco-white.png" alt="Logo Trisco Engenharia" />
          </span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <li className="subtitle">Página Principal</li>
          <li className="menu_links">
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="subtitle">Cadastros</li>
          <li className="menu_links">
            <Link to="./construtoras" style={{ textDecoration: "none" }}>
              <HolidayVillageRoundedIcon className="icon" />
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
            <Link to="./unidades" style={{ textDecoration: "none" }}>
              <AddBusinessRoundedIcon className="icon" />
              <span>Unidades</span>
            </Link>
          </li>
          <li>
            <Link to="./arquivos" style={{ textDecoration: "none" }}>
              <FileCopy  className="icon"/>
              <span>Arquivos</span>
            </Link>
          </li>
          {/* <li>
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
          </li> */}
          <li className="subtitle">Admin</li>
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
