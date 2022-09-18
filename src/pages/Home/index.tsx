import { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";

import Card from "../../components/Card/Card";
import "./home.scss";
import { LayoutContext } from "../../context/LayoutContext";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

const Home = () => {
  const layoutContext: any = useContext(LayoutContext);
  useEffect(() => {
    layoutContext.setNavbar_title("Tela Principal - Trisco Engenharia");
    return () => {};
  }, []);

  return (
    <>
      <div className="cardContainer">
        <Card title="construtoras" dados={20} />
        <Card title="empreendimentos" dados={20} />
        <Card title="arquivos" dados={20} />
      </div>
    </>
  );
};

export default Home;
