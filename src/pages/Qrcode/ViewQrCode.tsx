import { AddCircleRounded, AddRounded, AutoGraph, RemoveRedEyeRounded } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FilterArea } from "../../components/FilterArea";
import { LayoutContext } from "../../context/LayoutContext";
import QrCodeGenerator from "../../utils/QrCodeGenerator";

import "./styles.scss"

const ViewQrCode = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeList, setQrCodeList] = useState([]);
  const navigate = useNavigate()
  const layoutContext: any = useContext(LayoutContext);

  const [searchState, setSearchState]: any = useState({});

  const handleFilterButton = async () => {
    setIsLoading(true);
    let query = new URLSearchParams(searchState)
    const dataFetch = await axios.get(process.env.REACT_APP_APIURL + '/qrcode?' + query, {
      headers: {
        'authorization': localStorage.getItem('token') as any
      }
    })
    const data = await dataFetch.data
    setQrCodeList(data);
    setIsLoading(false);
  }

  const getStartList = async () => {
    setIsLoading(true)
    const query = axios.get(process.env.REACT_APP_APIURL + "/qrcode", {
      headers: {
        authorization: localStorage.getItem("token") as any,
      },
    });
    const { data } = await query
    setQrCodeList(data)
    setIsLoading(false)
  };


  useEffect(() => {
    layoutContext.setNavbar_title("Lista de QRCodes cadastrados.");
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
        <Button variant="contained" fullWidth startIcon={<AddCircleRounded />} onClick={() => navigate('./novo')}>
          Cadastrar
        </Button>
      </div>
      <div className="filterWrapper">
        <FilterArea setState={setQrCodeList} state={qrCodeList} />
      </div>
      <div className="qrCodeListWrapper">
        {isLoading ? <CircularProgress /> : ""}
        {qrCodeList.map((qrcode: any, index) =>
        (
          <div className="qrCodeWrapper" key={index}>
            <QrCodeGenerator data={qrcode} />
            <div className="qrCode_descr">
              <span className="description">Construtora:</span>
              <p className="">{qrcode.empreendimento.construtora.nome}</p>
              <span className="description">Empreendimento:</span>
              <p className="">{qrcode.empreendimento.nomeEmpreendimento}</p>
              <span className="description">Endereço da URL:</span>
              <p className="">{qrcode.url}</p>
              <span className="description">Endereço da URL Fixa:</span>
              <p className="">{process.env.REACT_APP_PUBLIC_URL}/qrcode/{qrcode.id}</p>
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
