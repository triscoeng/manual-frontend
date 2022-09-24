import { AddCircleRounded, AddRounded, AutoGraph, RemoveRedEyeRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { fontWeight } from "@mui/system";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QrCodeGenerator from "../../../utils/QrCodeGenerator";

import "../styles.scss"

const ViewQrCode = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeList, setQrCodeList] = useState([]);


  const getStartList = async () => {
    const query = axios.get(process.env.REACT_APP_APIURL + "/qrcode", {
      headers: {
        authorization: localStorage.getItem("token") as any,
      },
    });
    const { data } = await query
    setQrCodeList(data)
    console.log(data)
  };


  useEffect(() => {
    try {
      setIsLoading(true)
      getStartList().finally(() => setIsLoading(false))
    } catch (err: any) {
      setIsLoading(false)
      toast.error(err.message)
    }
  }, [])

  return (
    <div className="contentContainer">
      <h2>QrCodes Cadastrados <span style={{ fontWeight: '300', fontSize: '12px' }}>últimos 10 cadastros</span></h2>
      <div className="cadastro">
        <Button variant="contained" fullWidth startIcon={<AddCircleRounded />}>
          Cadastrar
        </Button>
      </div>
      <div className="filterWrapper"></div>
      <div className="qrCodeListWrapper">
        {qrCodeList.map((qrcode: any, index) =>
        (
          <div className="qrCodeWrapper" key={index}>
            <QrCodeGenerator data={qrcode} />
            <div className="qrCode_descr">
              <span className="description">Endereço da URL Fixa:</span>
              <p className="">{process.env.REACT_APP_PUBLIC_URL}/download/id={qrcode.id}</p>
              <span className="description">Endereço da URL:</span>
              <p className="">{qrcode.url}</p>
              <span className="description">Empreendimento:</span>
              <p className="">{qrcode.empreendimento.nomeEmpreendimento}</p>
              <span className="description">Construtora:</span>
              <p className="">{qrcode.empreendimento.construtora.nome}</p>
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
