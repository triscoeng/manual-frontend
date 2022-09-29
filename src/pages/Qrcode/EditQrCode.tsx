import { AddCircleRounded, CancelRounded, DeleteRounded } from "@mui/icons-material";
import { Button, Checkbox, FilledInput, FormControl, FormControlLabel, FormGroup, InputLabel, Radio, RadioGroup }
  from "@mui/material";
import { red } from "@mui/material/colors";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import './styles.scss'

const EditQrCode = () => {
  const { state, state: { empreendimento: { Arquivos: files } } }: any = useLocation()
  const [data, setData]: any = useState(state);
  const [editState, setEditState]: any = useState({ idEmpreendimento: data.empreendimento.id, url: data.url });

  const handleClearInput = () => {
    setEditState((prev: any) => ({
      ...prev,
      url: ''
    }))
  }

  const handleDeleteSubmit = async (e: any) => {
    await Swal.fire({
      title: "Confirmação de Exclusão",
      icon: "question",
      text: "Você está prestes a excluir o registro do QRCode. Você tem certeza disto?",
      showCancelButton: true,
      cancelButtonColor: red[300],
      cancelButtonText: "Cancelar"
    }).then(async (r: any) => {
      if (r.isConfirmed) {
        const request: any = await axios.delete(process.env.REACT_APP_APIURL + '/qrcode/' + data.id, {
          headers: {
            'authorization': localStorage.getItem("token") as any
          }
        })
          .then((r: any) => {
            console.log(r)
            toast.success("QRCode deletado com sucesso!")
            window.history.back();
          }).catch((error: any) => toast.error(error.message))
      } else {
        Swal.close()
      }
    })
  }

  const handleSubmit = async () => {
    await axios.put(process.env.REACT_APP_APIURL + '/qrcode/' + data.id, editState, {
      headers: {
        'authorization': localStorage.getItem('token') as any
      }
    })
      .then(async (r) => {
        toast.success("QR Code editado com sucesso.")
        window.history.back();
      })
      .catch((error: any) => {
        toast.error(error.data.message)
      })
  }



  return (
    <div className="contentContainer">
      <h2>{data ? "Edição de QRCode" : "Criação de QR Code"}</h2>
      <div className="formWrapper">
        <form action="">
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cep">Construtora:</InputLabel>
            <FilledInput
              id="construtora"
              disabled={true}
              value={data.empreendimento.construtora.nome || null}
              onChange={(e: any) => console.log(e.target.value)}
            />
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cep">Empreendimento:</InputLabel>
            <FilledInput
              id="empreendimento"
              disabled={true}
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
                <FormControl>
                  <RadioGroup value={editState.url}>
                    {files && files.map((single: any, index: any) => {
                      return <FormControlLabel
                        label={single.nomeArquivo}
                        name={single.nomeArquivo} key={index}
                        control={
                          <Radio
                            checked={editState.url.includes(single.nomeArquivo)}
                            onClick={(e: any) =>
                              setEditState((prev: any) =>
                                ({ ...prev, url: 'https://www.triscoengenharia.com.br/_manuais/' + e.target.name }))
                            } />}
                      />
                    })}
                  </RadioGroup>
                </FormControl>
              </FormGroup>
            </div>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth variant="filled">
            <InputLabel htmlFor="cep">Endereço da URL</InputLabel>
            <FilledInput
              id="url"
              value={editState.url}
              endAdornment={editState.url !== (null || undefined) ? <CancelRounded onClick={handleClearInput}
                sx={{ color: red[300] }} /> : ''}
              onChange={(e: any) => setEditState((prev: any) =>
                ({ ...prev, url: e.target.value }))}
            />
          </FormControl>
          <br />
          <br />
          <Button startIcon={<AddCircleRounded />} variant="contained" onClick={handleSubmit}>
            Salvar
          </Button>
          <Button onClick={() => window.history.back()} startIcon={<CancelRounded />} variant="contained" sx={{ m: 1 }} color="warning">
            Voltar
          </Button>
          <Button startIcon={<DeleteRounded />} variant="contained" sx={{ m: 1 }} color="error"
            onClick={handleDeleteSubmit}>
            Deletar
          </Button>
        </form>
      </div>
    </div >
  )
}

export default EditQrCode