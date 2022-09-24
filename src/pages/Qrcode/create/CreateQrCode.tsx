import { AddCircleRounded, CancelRounded, DeleteRounded } from "@mui/icons-material";
import { Button, Checkbox, FilledInput, FormControl, FormControlLabel, FormGroup, InputLabel }
  from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CreateQrCode = () => {
  const { state, state: { empreendimento: { Arquivos: files } } }: any = useLocation()

  const [data, setData]: any = useState(state);
  const [arquivos, setArquivos]: any = useState(files);
  const [arquivoSelected, setArquivoSelected]: any = useState({});
  const { url } = data



  const [checkBoxState, setCheckBoxState]: any = useState({
    '35ba9835-9b00-4acf-acd1-b718881c5eec': {
      checked: true,
      nome: "novare_guia_r_pido_dehon.pdf"
    },
    'e4b780b6-e041-46f3-bf82-cb843c1c809c': {
      checked: false,
      nome: "qrcode_manual_dohan_v2_propriet_rio.pdf"
    },
  });

  let test: any = {}
  for (const iterator of arquivos) {
    test[iterator.id] = {
      nome: iterator.nomeArquivo,
      checked: url.includes(iterator.nomeArquivo)
    }
  }

  console.log(test)


  // {
  //   [iterator.id]: {
  //     nome: iterator.nomeArquivo,
  //     checked: url.includes(iterator.nomeArquivo)
  //   }
  // }
  // const file = arquivos.map((arquivo: any) => {
  //   if (url.includes(arquivo.nomeArquivo)) {
  //     return {
  //       id: arquivo.id,
  //       nome: arquivo.nomeArquivo,
  //       checked: true
  //     }
  //   }
  // })
  // console.log(file[0])


  return (
    <div className="contentContainer">
      <h2>{data ? "Edição de QRCode" : "Criação de QR Code"}</h2>
      <div className="formWrapper">
        <form action="">
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cep">Construtora:</InputLabel>
            <FilledInput
              id="url"
              value={data.empreendimento.construtora.nome || null}
              onChange={(e: any) => console.log(e.target.value)}
            />
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cep">Empreendimento:</InputLabel>
            <FilledInput
              id="url"
              value={data.empreendimento.nomeEmpreendimento || null}
              onChange={(e: any) => console.log(e.target.value)}
            />
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
              <FormGroup>
                {arquivos && arquivos.map((v: any, index: any) => (
                  <FormControlLabel
                    control={
                      <Checkbox key={index} checked={checkBoxState[v.id].checked} name={v.id}
                        onChange={(e: any) => { checkBoxState[v.id].checked = false }}
                      />}
                    label={v.nomeArquivo} />
                ))}
              </FormGroup>
            </div>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cep">Endereço da URL</InputLabel>
            <FilledInput
              id="url"
              value={data.url}
              onChange={(e: any) => console.log(e.target.value)}
            />
          </FormControl>
          <br />
          <br />
          <Button startIcon={<AddCircleRounded />} variant="contained" onClick={() => {
            console.log(data)
          }}>
            Salvar
          </Button>
          <Button startIcon={<CancelRounded />} variant="contained" sx={{ m: 1 }} color="warning">
            Cancelar
          </Button>
          <Button startIcon={<DeleteRounded />} variant="contained" sx={{ m: 1 }} color="error">
            Deletar
          </Button>
        </form>
      </div>
    </div >
  )
}

export default CreateQrCode