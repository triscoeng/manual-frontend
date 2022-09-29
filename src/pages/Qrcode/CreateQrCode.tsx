import { AddCircleRounded, CancelRounded, CheckBox, DeleteRounded } from "@mui/icons-material";
import { Button, Checkbox, CircularProgress, FilledInput, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, Radio, RadioGroup }
  from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AsyncSelect from "react-select/async"
import Select from "react-select"
import axios from "axios";

import './styles.scss'
import { red } from "@mui/material/colors";
import { toast } from "react-toastify";


const CreateQrCode = () => {

  // STATES
  const [construtoras, setConstrutoras]: any = useState();
  const [empreendimento, setEmpreendimento]: any = useState();
  const [isLoading, setIsLoading]: any = useState(false);
  const [arquivosEmp, setArquivosEmp]: any = useState([]);
  const [arquivoSelected, setArquivoSelected]: any = useState();
  const [url, setUrl] = useState("");

  const [cadastroState, setCadastroState]: any = useState({ url: "" });



  // Axios
  const getConstrutoraDataAsync: any = async (searchData: any, callback: any) => {
    const data = await axios.get(process.env.REACT_APP_APIURL + "/construtoras/names", {
      headers: {
        authorization: localStorage.getItem("token") as any,
      }
    })
      .then((result: any) => result.data.map((data: any) => ({
        value: data.id,
        label: data.nome,
      })))
      .then((final: any) => final.filter((i: any) => i.label.toLowerCase().includes(searchData.toLowerCase())))
    callback(data);
    return data
  }

  const getEmpDataAsync: any = async (searchData: any, callback: any) => {
    setIsLoading(true)
    const data = await axios.get(process.env.REACT_APP_APIURL + "/construtora/" + cadastroState.idConstrutora, {
      headers: {
        authorization: localStorage.getItem("token") as any,
      }
    })
      .then(({ data: { Empreendimentos } }) => Empreendimentos.map((emp: any) => ({
        value: emp.id,
        label: emp.nomeEmpreendimento
      })))
    // console.log(Empreendimentos)
    setEmpreendimento(data)
    setIsLoading(false)
    return data;
  }


  const getFilesFromEmp: any = async (id: any) => {
    setIsLoading(true)
    const { data: query }: any = await axios.get(process.env.REACT_APP_APIURL + "/empreendimento/" + id, {
      headers: {
        authorization: localStorage.getItem("token") as any,
      }
    }
    ).then((r: any) => setArquivosEmp(r.data.Arquivos))
      .finally(() => setIsLoading(false))
  }

  const handleSubmit = async () => {
    await axios.post(process.env.REACT_APP_APIURL + "/qrcode/", cadastroState, {
      headers: {
        authorization: localStorage.getItem("token") as any,
      }
    }).then(async (r: any) => {
      console.log(r)
      if (r.data) {
        toast.success("QRCode cadastrado com sucesso.")
      }
    }).catch((error: any) => toast.error(error.message))
  }

  useEffect(() => {
    getEmpDataAsync()
  }, [cadastroState.idConstrutora])

  return (
    <div className="contentContainer">
      <h2>{"Criação de QR Code Dinâmico"}</h2>
      <div className="formWrapper">
        <form action="">
          <FormControl fullWidth variant="filled">
            <AsyncSelect
              placeholder={"Escolha a construtora"}
              closeMenuOnSelect={true}
              loadOptions={getConstrutoraDataAsync}
              defaultOptions={true}
              onChange={(e: any) => {
                setCadastroState((prev: any) =>
                  ({ ...prev, idConstrutora: e.value }))
              }
              }
            />
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth variant="filled">
            {cadastroState.idConstrutora && <Select
              placeholder={"Escolha um Empreendimento"}
              options={empreendimento}
              onChange={async (e: any) => {
                setCadastroState((prev: any) => ({ ...prev, idEmpreendimento: e.value }))
                await getFilesFromEmp(e.value)
              }}
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