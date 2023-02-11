import { AddCircleRounded, CancelRounded } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup
}
  from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Select from "react-select"
import axios from "axios";

import './styles.scss'
import { red } from "@mui/material/colors";
import { toast } from "react-toastify";
import useFetchData from "../../utils/useFetchData";
import { LayoutContext } from "../../context/LayoutContext";


const CreateQrCode = () => {

  // STATES
  const [construtoras, setConstrutoras]: any = useState();
  const [empreendimentos, setEmpreendimentos]: any = useState([]);
  const [arquivosEmp, setArquivosEmp]: any = useState([]);

  const [isLoading, setIsLoading]: any = useState(false);
  const [arquivoSelected, setArquivoSelected]: any = useState();
  const [url, setUrl] = useState("");

  const [cadastroState, setCadastroState]: any = useState({ url: "" });
  const companies: any = useFetchData('/construtoras/list', 'GET')
  const layoutContext: any = useContext(LayoutContext)

  useEffect(() => {
    layoutContext.setNavbar_title("Cadastro de novo QRCode para: " + empreendimentos?.label);
  }, [])

  // Axios
  const handleCompanyChange: any = (e: any) => {
    setCadastroState((prev: any) =>
      ({ ...prev, idConstrutora: e.value }))
    setConstrutoras(e)
    setEmpreendimentos(e.empreendimentos)
  }

  const handleEmpChange: any = (e: any) => {
    setCadastroState((prev: any) => ({ ...prev, idEmpreendimento: e.value }))
    setArquivosEmp(e.arquivos)
  }

  useEffect(() => {
    console.log(empreendimentos)
  }, [empreendimentos])


  const handleSubmit = async () => {
    await axios.post(import.meta.env.VITE_APIURL + "/qrcode/", cadastroState, {
      headers: {
        authorization: localStorage.getItem("token") as any,
      }
    }).then(async (r: any) => {
      console.log(r)
      if (r.data) {
        toast.success("QRCode cadastrado com sucesso.")
        window.history.back()
      }
    }).catch((error: any) => toast.error(error.message))
  }


  return (
    <div className="contentContainer">
      <h2>{"Criação de QR Code Dinâmico"}</h2>
      <div className="formWrapper">
        <form action="">
          <FormControl fullWidth variant="filled">
            {
              companies.isLoading ?
                <CircularProgress />
                :
                <Select
                  placeholder={"Escolha a construtora"}
                  closeMenuOnSelect={true}
                  options={companies?.apiData}
                  onChange={handleCompanyChange}
                />
            }
            {/* <AsyncSelect
              placeholder={"Escolha a construtora"}
              closeMenuOnSelect={true}
              loadOptions={getConstrutoraDataAsync}
              defaultOptions={true}
              onChange={(e: any) => {
                setCadastroState((prev: any) =>
                  ({ ...prev, idConstrutora: e.value }))
              }
              }
            /> */}
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth variant="filled">
            {cadastroState.idConstrutora
              &&
              <Select
                isClearable={true}
                placeholder={"Escolha um Empreendimento"}
                options={empreendimentos}
                onChange={handleEmpChange}
              />}
          </FormControl>
          <br />
          <br />
          <FormControl>
            <h4>Arquivos Hospedados</h4>
            <span style={{ fontWeight: '300', fontSize: '12px' }}>Caso queira utilizar algum arquivo
              hospedado pela Trisco Engenharia, selecione-o uma opção abaixo para atualizar o
              endereço da URL do QRCode.
            </span>
            <div className="fileHiddenWrapper">
              {(cadastroState.idEmpreendimento && isLoading) && <CircularProgress />}
              {!isLoading &&
                <FormControl>
                  <RadioGroup
                    value={cadastroState.url}
                  >
                    {
                      arquivosEmp && arquivosEmp.map((arquivo: any, index: any) => (
                        <FormControlLabel
                          key={index}
                          label={arquivo.nomeArquivo}
                          checked={cadastroState.url.includes(arquivo.nomeArquivo)}
                          control={<Radio onClick={(e: any) => {
                            setCadastroState((prev: any) =>
                              ({ ...prev, url: e.target.value })
                            )
                          }} />}
                          value={"https://www.triscoengenharia.com.br/_manuais/" + arquivo.nomeArquivo}

                        />
                      ))

                    }
                  </RadioGroup>
                </FormControl>
              }
            </div>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cep">Endereço da URL</InputLabel>
            <FilledInput
              id="url"
              value={cadastroState.url}
              endAdornment={cadastroState.url ?
                <CancelRounded
                  sx={{ color: red[500] }}
                  onClick={() => {
                    setCadastroState((prev: any) => ({
                      ...prev,
                      url: ""
                    }))
                  }} /> : ""}
              onChange={(e: any) => {
                setCadastroState((prev: any) =>
                  ({ ...prev, url: e.target.value })
                )
              }
              }
            />
          </FormControl>
          <br />
          <br />
          <Button startIcon={<AddCircleRounded />} variant="contained" onClick={() => {
            console.log(cadastroState)
            handleSubmit()
          }}>
            Salvar
          </Button>
          <Button onClick={() => console.log(arquivoSelected)} startIcon={<CancelRounded />} variant="contained" sx={{ m: 1 }} color="error">
            Cancelar
          </Button>
        </form>
      </div>
    </div >
  )
}

export default CreateQrCode