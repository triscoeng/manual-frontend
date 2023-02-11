import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, FormControlLabel, TextField } from '@mui/material'
import axios from 'axios'
import Select from "react-select"


import './UnidadesForm.scss'
import { AddCircleOutlineOutlined, Attachment } from '@mui/icons-material'
import { toast } from 'react-toastify'

export default function UnidadesForm() {

  const [loading, setLoading] = useState(false)
  const [construtorasList, setConstrutorasList] = useState()
  const [empByConstrutoraList, setEmpByConstrutoraList]: any = useState()
  const [construtoraSelected, setConstrutoraSelected]: any = useState()


  const [nomeUnidade, setNomeUnidade]: any = useState()
  const [empreendimentoSelected, setEmpreendimentoSelected]: any = useState()
  const [isPrivate, setIsPrivate]: any = useState(false)
  const [arquivosList, setArquivosList]: any = useState([])

  async function getCompanies() {
    await axios.get(import.meta.env.VITE_APIURL + '/construtoras',
      {
        headers: {
          'Authorization': localStorage.getItem('token') as any
        }
      })
      .then((r) => {
        setConstrutorasList(r.data)
      })
  }

  function handleCheckedChange(e: any) {
    const { checked, value } = e.target
    const selectedFiles = arquivosList.filter((v: any) => v.checked)
    if (selectedFiles.length > 0 && !isPrivate && checked) {
      toast.error("Quando a unidade é padrão somente um arquivo é permitido!")
      return null
    }
    const filesTemp = [...arquivosList]
    filesTemp[value].checked = !filesTemp[value].checked
    setArquivosList(filesTemp)
  }

  async function handleFormSubmit(e: any) {
    e.preventDefault()
    const dataForm = new FormData()
    arquivosList.filter((v: any) => v.checked).map(({ id }: { id: string }) => {
      dataForm.append('arquivosId[]', id)
    })
    dataForm.append('idEmpreendimento', empreendimentoSelected?.id)
    dataForm.append('nome', nomeUnidade)
    dataForm.append('categoria', isPrivate ? 1 : 0)

    try {
      setLoading(true)
      await axios.post(import.meta.env.VITE_APIURL + '/unidades', dataForm, {
        headers: {
          authorization: localStorage.getItem("token") as string,
        }
      }).then((r) => {
        if (r.data) {
          toast.success("Unidade cadastrada com sucesso");
          window.history.back()
        }
      })
    } catch (error: any) {
      toast.error(error.response.data)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    setLoading(true)
    Promise.all([getCompanies()]).then((a) => {
      setLoading(false)
    })
  }, []);

  return (
    <div className="empreendimentosContainer">
      <h2>Cadastro de Unidade:</h2>
      <div>
        {loading ? <CircularProgress /> :
          <form>
            <div className='form-group'>
              <FormControlLabel
                className='subtitulo'
                control={
                  <Select
                    placeholder="Construtora"
                    menuPortalTarget={document.body}
                    id="construtora"
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    name="idConstrutora"
                    isClearable={true}
                    options={construtorasList}
                    getOptionLabel={(v: any) => v.nome}
                    getOptionValue={(v: any) => v.id}
                    onChange={(v: any) => {
                      if (v) {
                        setConstrutoraSelected(v.id)
                        setEmpByConstrutoraList(v.Empreendimentos)
                      } else {
                        setConstrutoraSelected([])
                        setEmpByConstrutoraList([])
                        setEmpByConstrutoraList([])

                      }
                    }}
                  />
                }
                label="Escolha a Construtora"
                labelPlacement='top'
              />
              <FormControlLabel
                className='subtitulo'
                label="Empreendimentos"
                labelPlacement='top'
                control={
                  <Select
                    name="idEmpreendimento"
                    placeholder="Empreendimento"
                    isDisabled={!construtoraSelected ? true : false}
                    id="empreendimento"
                    isClearable={true}
                    options={empByConstrutoraList}
                    getOptionLabel={(v: any) => v.nomeEmpreendimento}
                    value={empreendimentoSelected}
                    onChange={(v) => {
                      if (v) {
                        setEmpreendimentoSelected(v)
                        const arquivosFixed = v.Arquivos.map((file: any, index: any) => (
                          {
                            i: index,
                            id: file.id,
                            nomeExibicao: file.nomeExibicao,
                            checked: false
                          }
                        ))
                        setArquivosList(arquivosFixed)
                      } else {
                        setEmpreendimentoSelected([])
                        setArquivosList([])
                      }
                    }}
                  />
                }
              />
            </div>
            <div className='categoria-unidade'>
              <p className="subtitulo">Usuário para a unidade:</p>
              <TextField
                name="nomeUnidade"
                variant="outlined"
                label="Nome da Unidade"
                style={{ backgroundColor: '#fff' }}
                onChange={(e: any) => setNomeUnidade(e.target.value)}
              />
            </div>
            <div className='categoria-unidade'>
              <p className="subtitulo">Categoria de Unidade:</p>
              <div className="checkbox-area">
                <span className={!isPrivate ? '' : 'span-inactive'}>Padrão</span>
                <input
                  id="inpLock"
                  type="checkbox"
                  defaultChecked={isPrivate}
                  checked={isPrivate}
                  onChange={(v) => {
                    if (isPrivate && arquivosList.filter((v: any) => v.checked).length > 1) {
                      return toast.error("Não é possível alterar para padrão pois a unidade possui mais de uma arquivo selecionado!")
                    }
                    setIsPrivate(v.target.checked)
                  }}
                />
                <label className="btn-lock" htmlFor="inpLock">
                  <svg width="36" height="40" viewBox="0 0 36 40">
                    <path className="lockb" d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"></path>
                    <path className="lock" d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"></path>
                    <path className="bling" d="M29 20L31 22"></path>
                    <path className="bling" d="M31.5 15H34.5"></path>
                    <path className="bling" d="M29 10L31 8"></path>
                  </svg>
                </label>
                <span className={!isPrivate ? 'span-inactive' : ''}>Privado</span>
              </div>
            </div>
            <div>
              <div className="files-area">
                <p className="subtitulo">Arquivos Disponíveis:</p>
                {
                  empreendimentoSelected && arquivosList.map((file: any, index: any): any => {
                    return (
                      <div key={file.id}>
                        <label htmlFor={`check-${index}`} className="files-item">
                          <input type="checkbox" id={`check-${index}`}
                            value={index}
                            onChange={handleCheckedChange}
                            checked={arquivosList[index].checked}
                          />
                          <span><Attachment style={{ color: arquivosList[index].checked ? '#597aff' : '#d1d1d1' }} /></span><p>{arquivosList[index].nomeExibicao}</p>
                        </label>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div style={{ margin: '12px 0' }}>
              <Button startIcon={<AddCircleOutlineOutlined />} variant="contained" color="success"
                disabled={loading ? true : false}
                onClick={handleFormSubmit}>
                CADASTRAR
              </Button>
            </div>
          </form >
        }
        </div>
    </div >
      )
}
