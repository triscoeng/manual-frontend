import { useContext, useEffect, useState } from "react";

import Card from "../../components/Card/Card";
import "./home.scss";
import { LayoutContext } from "../../context/LayoutContext";
import useFetchData from "../../utils/useFetchData";
import { CircularProgress } from "@mui/material";

const Home = () => {
  const layoutContext: any = useContext(LayoutContext);
  useEffect(() => {
    layoutContext.setNavbar_title("Trisco Engenharia - Administração de QR Codes ");
    return () => { };
  }, []);
  const { apiData, isLoading }: any = useFetchData('/home', 'GET')

  return (
    <div className="cardContainer">
      {
        isLoading ? <CircularProgress /> :
          <>
            <Card title="construtoras" dados={apiData?.construtoras} />
            <Card title="empreendimentos" dados={apiData?.empreendimentos} />
            <Card title="arquivos" dados={apiData?.arquivos} />
            <Card title="qrcode" dados={apiData?.qrcode} />
          </>
      }
    </div>
  );
};

export default Home;
