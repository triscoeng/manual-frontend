import { AddCircleRounded, AddRounded, AutoGraph, RemoveRedEyeRounded } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FilterArea } from "../../components/FilterArea";
import { LayoutContext } from "../../context/LayoutContext";
import QrCodeGenerator from "../../utils/QrCodeGenerator";
import useFetchData from "../../utils/useFetchData";

import "./styles.scss"

const ViewQrCode = () => {

  const navigate = useNavigate()
  const layoutContext: any = useContext(LayoutContext);
  const [searchState, setSearchState]: any = useState({});
  const qrCodeApiData: any = useFetchData(process.env.REACT_APP_APIURL + "/qrcode", "get")

  useEffect(() => {
    console.log(qrCodeApiData)
  }, [qrCodeApiData])


  useEffect(() => {
    layoutContext.setNavbar_title("Lista de QRCodes cadastrados.");
  }, [])


  return (
    <div className="contentContainer">
      <h2>QrCodes Cadastrados <span style={{ fontWeight: '300', fontSize: '12px' }}>últimos 10 cadastros</span></h2>
      <div className="cadastro">
        <Button variant="contained" fullWidth startIcon={<AddCircleRounded />} onClick={() => navigate('./novo')}>
          Cadastrar
        </Button>
      </div>
      <div className="filterWrapper">
        <FilterArea setState={setSearchState} state={searchState} onPressFilter={() => { console.log(searchState) }} />
      </div>
      {qrCodeApiData.isLoading ? <CircularProgress color="success" sx={{ alignSelf: 'center' }} /> : ""}
      <div className="qrCodeListWrapper">
        {qrCodeApiData.apiData?.map((qrcode: any, index: any) =>
        (
          <div className="qrCodeWrapper" key={index}>
            <QrCodeGenerator data={qrcode} />
            <div className="qrCode_descr">
              <span className="description">Construtora:</span>
              <p className="">{qrcode.construtora.label}</p>
              <span className="description">Empreendimento:</span>
              <p className="">{qrcode.empreendimento.label}</p>
              <span className="description">Endereço da URL Fixa (origem):</span>
              <p className="">{process.env.REACT_APP_PUBLIC_URL}/qrcode/{qrcode.id}</p>
              <span className="description">Endereço da URL (destino):</span>
              <p className="">{qrcode.url}</p>
            </div>
            <div className="qrCode_counter">
              <RemoveRedEyeRounded />
              <p>{qrcode.view_count}</p>
            </div>
          </div>
        )
        )}
      </div>
    </div >
  );
};

export default ViewQrCode;
