import React, { useState, useEffect } from 'react'
import './UnidadeView.scss'
import { useLocation } from "react-router-dom";
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import { ArrowLeftRounded, CheckRounded, ChevronLeft, CleaningServices, ContentCopy, Edit, FileUploadRounded, Folder, Link, Save, SaveAltRounded } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { LayoutContext } from '../../context/LayoutContext'


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function UnidadeView() {

  const [editMode, setEditMode] = React.useState(false)
  const layoutContext: any = React.useContext(LayoutContext);




  const { state }: any = useLocation()
  const [filesChecked, setFilesChecked]: any = useState([])
  const [tabSelected, setTabSelected]: any = useState(0)
  const [customUrl, setCustomUrl]: any = useState()

  console.log(state)
  const handleInputCustomUrlChange = (e: any) => {
    e.preventDefault()
    setCustomUrl(e.target.value)
  }

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
      await axios.patch(import.meta.env.VITE_APIURL + '/unidades', { id: state.id, arquivos: filesChecked, customUrl: customUrl }, {
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
    layoutContext.setNavbar_title(`Detalhes da Unidade: ${state.nome} / ${state.empreendimento.nomeEmpreendimento} / ${state.empreendimento.construtora.nome}`)
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
        {
          state.qrCode.url &&
          <p>{state.qrCode.url}</p>
        }
        {state.arquivo && state.arquivo.map((file: any) => {
          return (
            <p key={file.id}>{file.nomeExibicao}</p>
          )
        })}
      </div>
      {
        editMode &&
        <div style={{ display: editMode ? 'inline-block' : 'none' }}>
          <h2>Acesso à Arquivos:</h2>
          <Tabs
            selectionFollowsFocus
            value={tabSelected}
            onChange={(event: React.SyntheticEvent, newValue: number) => {
              setTabSelected(newValue)
            }}

          >
            <Tab icon={<Folder />} label="Arquivos Hospedados" id="0" />
            <Tab icon={<Link />} label="Link Personalizado" id="1" />
          </Tabs>

          <TabPanel value={tabSelected} index={0}>
            <Box>
              <div className='unidades' >
                <p>Selecione os arquivos disponíveis cadastrados para o empreendimento:</p>
                {state.empreendimento.Arquivos.map((file: any) => {
                  return (
                    <div key={file.id} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        onChange={handleChangeCheckboxInput}
                        type="checkbox"
                        key={file.id}
                        name={file.id}
                        id={file.id}
                        defaultChecked={getChecked(file)}
                        style={{ margin: '4px 12px' }}
                      />
                      <label htmlFor={file.id}>{file.nomeExibicao}</label>
                    </div>
                  )
                })}
              </div>
            </Box>
          </TabPanel>
          <TabPanel index={1} value={tabSelected}>
            <p>Qual o endereço para direto para o arquivo disponibilizado pela construtora:</p>
            <input type="url" name="linkArquivo" id="linkArquivo" className='inputUrl'
              placeholder='URL (http://...)'
              onChange={handleInputCustomUrlChange}
            />
          </TabPanel>
          <div style={{ margin: '12px 0' }}>
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