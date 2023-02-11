import React, { useState, useEffect } from 'react'
import './UnidadeView.scss'
import { useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import { ArrowLeftRounded, CheckRounded, ChevronLeft, CleaningServices, ContentCopy, Edit, Save, SaveAltRounded } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

function UnidadeView() {

  const [editMode, setEditMode] = React.useState(false)


  const { state }: any = useLocation()
  const [filesChecked, setFilesChecked]: any = useState([])

  const handleStartCheckedFiles = () => {
    for (const file of state.arquivo) {
      setFilesChecked((prev: any) => (
        [
          ...prev,
          file.id
        ]
      ))
    }
  }

  const getChecked = (file: any) => {
    const find = state.arquivo.find((v: any) => v.id === file.id)
    return find ? true : false
  }

  const handleChangeCheckboxInput = (e: any) => {

    if (e.target.checked) {
      setFilesChecked((prev: any) => (
        [
          ...prev,
          e.target.id
        ]
      ))
    } else {
      const find = filesChecked.indexOf(e.target.id)
      let newArr = filesChecked.splice(find, 1)
      setFilesChecked(filesChecked)
    }
  }

  const handleFormSubmit = async () => {
    if (state.categoria === 0 && filesChecked.length > 1) {
      return toast.error("Unidade padrão é permitido somente um arquivo")
    }
    try {
      await axios.patch(import.meta.env.VITE_APIURL + '/unidades', { id: state.id, arquivos: filesChecked }, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(async (r) => {
        toast.success("Unidade editada com sucesso.")
      }).finally(() => {
        window.history.back()
      })
    } catch (error) {
      return toast.error("Ocorreu um erro na edição da unidade")
    }

  }

  useEffect(() => {
    return () => handleStartCheckedFiles()
  }, [])

  return (
    <div className='homeContainer'>
      <div className='contentContainer unidades'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Detalhes da Unidade:</h2>
          <div className='buttonsWrapper'>
            <Button
              className="buttonUnidades"
              variant='contained'
              color="success"
              onClick={() => window.history.back()}>
              <ChevronLeft />
            </Button>
            <Button variant='contained' onClick={() => setEditMode(!editMode)}>
              <Edit />
            </Button>
          </div>

        </div>
        <div className='unidadeGroup'>
          <p>Construtora: <span>{state.empreendimento.construtora.nome}</span></p>
        </div>
        <div className='unidadeGroup'>
          <p>Empreendimento: <span>{state.empreendimento.nomeEmpreendimento}</span></p>
        </div>
        <div className='unidadeGroup'>
          <p>Nome da Unidade: <span>{state.nome}</span></p>
        </div>
        <div className='unidadeGroup'>
          <p>Categoria: <span>{state.categoria === 1 ? "Privada" : "Padrão"}</span></p>
        </div>
        <div className='unidadeGroup'>
          <p>Quantidade de Arquivos: <span>{state.arquivo.length}</span></p>
        </div>
        <div className="unidadeGroup">
          <p>Link QRCode:<br /> <span>{import.meta.env.VITE_PUBLIC_URL}/qrcode/{state.id}</span></p>
        </div>
        <h2>Arquivos (selecionados):</h2>
        <div className='unidades'>
          {state.arquivo.map((file: any) => {
            return (
              <p key={file.id}>{file.nomeExibicao}</p>
            )
          })}
        </div>
        {
          editMode &&
          <div style={{ display: editMode ? 'inline-block' : 'none' }}>
            <h2>Arquivos Disponíveis</h2>
            <div className='unidades alignCenter' >
              {state.empreendimento.Arquivos.map((file: any) => {
                return (
                  <div key={file.id}>
                    <input
                      onChange={handleChangeCheckboxInput}
                      type="checkbox"
                      key={file.id}
                      name={file.id}
                      id={file.id}
                      defaultChecked={getChecked(file)} />
                    <label htmlFor={file.id}>{file.nomeExibicao}</label>
                  </div>
                )
              })}
            </div>
            <div>
              <Button variant="contained" startIcon={<Save />} onClick={handleFormSubmit}>
                Salvar
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default UnidadeView