import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../utils/useFetchData";
import PaginaDoUsuario from "../PaginaDoUsuario/PaginaDoUsuario";
import SingleDownload from "../PaginaDoUsuario/SingleDownload";

import "./styles.scss"

const DownloadFileRoute = () => {
  const params = useParams();
  const data: any = useFetchData(import.meta.env.VITE_APIURL + '/download?id=' + params.id)



  useEffect(() => {

    if (!data.isLoading && data.apiData.categoria !== 1) {
      window.location.href = `${import.meta.env.VITE_APIURL}/${data.apiData.arquivo[0].urlArquivo}`
    }

  }, [data])


  return (
    <>
      {
        data.isLoading ?
          <div className="downloadWrapper">
            <div className="innerWrapper">
              <div className="content">
                <div className="header">
                  <img src="/images/logo-trisco-white.png" />
                  <p>Por favor aguarde!</p>
                  <p>Seu arquivo está sendo preparado para o download e você
                    será automaticamente redirecionado. </p><br />
                </div>
                <div className="counter">
                  <CircularProgress />
                </div>
              </div>
            </div>
          </div>
          :
          data.apiData.categoria
            ?
            <PaginaDoUsuario data={data.apiData} />
            :
            <div className="downloadWrapper">
              <div className="innerWrapper">
                <img src="/images/logo-trisco-white.png" />
                <div className="content">
                  <div className="header">
                    <p>Seu arquivo já está sendo baixado!</p>
                    <p>Verifique sua lista de downloads ou aperte na notificação do seu navegador. </p><br />
                    <p>Caso o arquivo não iniciou o download, por favor aperte no botão abaixo. </p><br />
                  </div>
                  <div className="counter">
                    <Button variant="contained" color="success"
                      onClick={() => window.location.href = `${import.meta.env.VITE_APIURL}/${data.apiData.arquivo[0].urlArquivo}`}
                    >
                      Baixar Arquivo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
      }
    </>
  );
};

export default DownloadFileRoute;
