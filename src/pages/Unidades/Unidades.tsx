import React, { useReducer } from 'react'
import { AddCircleOutline, ContentCopy } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControlLabel, Icon } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Select from 'react-select';
import { useNavigate, Link } from 'react-router-dom'
import QrCodeGenerator from '../../utils/QrCodeGenerator'
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LayoutContext } from '../../context/LayoutContext'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import useFetchData from '../../utils/useFetchData'
import usePagination from '../../utils/usePagination'
import Pagination from '@mui/material/Pagination'

import './UnidadesForm.scss'

interface IUnidade {
  nome: string,
  categoria: number,
  empreendimento: {
    nomeEmpreendimento: string
    construtora: {
      nome: true
    }
  }
  id: string,
}

export default function Unidades() {
  const { data, isLoading, refresh }: any = useFetchData('/unidades')
  const [filterData, setFilterData] = useState([])

  function reducer(state: any, action: any) {
    switch (action.type) {
      case 'setarConstrutora':
        const empList = action.data?.map((unidade: any) => ({ label: unidade.empreendimento.nomeEmpreendimento, value: unidade.empreendimento.id, parent: unidade.empreendimento.construtora.id })).filter(((emp: any) => emp.parent === action.construtora.value)).filter((v: any, i: any, array: any) => {
          return array.map((x: { value: string }) => x.value).indexOf(v.value) === i;
        })

        return {
          ...state,
          construtoraSelected: action.construtora,
          empreendimentoSelected: '',
          empByConstrutora: empList
        }

      case 'setarEmpreendimento':
        return {
          ...state,
          empreendimentoSelected: action.empreendimento
        }
      case 'limparEmpreendimento':
        return {
          ...state,
          empreendimentoSelected: ''
        }

      case 'filtrarLista':
        const { data } = action
        const teste = data.filter((v: any) => v.empreendimento.idConstrutora === state.construtoraSelected.value &&
          (
            state.empreendimentoSelected === ''
            ||
            v.idEmpreendimento === state.empreendimentoSelected.value
          )
        )
        setFilterData(teste)

        return {
          ...state
        }

      case 'limparConstrutora':
        return {
          construtoraSelected: '',
          empByConstrutora: '',
          empreendimentoSelected: ''
        }
        break
      default:
        break;
    }

  }

  const [state, dispatch] = useReducer(reducer, {
    construtoraSelected: '',
    empByConstrutora: '',
    empreendimentoSelected: ''
  });



  const [page, setPage] = useState(1)
  const per_page = 15
  const numPages = Math.ceil((filterData?.length > 0 ? filterData?.length : data?.length) / per_page)
  const _DATA = usePagination(filterData?.length > 0 ? filterData : data, per_page)

  const layoutContext: any = React.useContext(LayoutContext);

  const handleDeleteUnidade = async (id: string) => {
    const modal = await Swal.fire({
      title: 'Exclusão de Unidade',
      icon: 'question',
      backdrop: true,
      text: "Você deseja excluir esta unidade? Após a operação concluída ela não poderá ser desfeita!",
      showCancelButton: true,
      cancelButtonColor: "green",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Deletar",
      confirmButtonColor: 'red',
      showConfirmButton: true
    })
    if (modal.isConfirmed) {
      await axios.delete(import.meta.env.VITE_APIURL + '/unidade/' + id, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(async (r) => {
        toast.success("Unidade removida com sucesso!")
        refresh()
      })
    } else {
      toast.info("Operação Cancelada")
    }
  }

  useEffect(() => {
    layoutContext.setNavbar_title("Lista de Unidades Cadastradas");
  }, [])

  const handlePageChange = (e: any, p: any) => {
    e.preventDefault()
    setPage(p)
    _DATA.jump(p)
  }

  const handleConstrutoraFilterChange = (v: any) => {
    if (!v) {
      return dispatch({ type: 'limparConstrutora' })
    }
    return dispatch({ type: 'setarConstrutora', construtora: v, data })
  }

  const constList = data?.map((unidade: any) => ({ label: unidade.empreendimento.construtora.nome, value: unidade.empreendimento.construtora.id })).filter((value: any, i: number, s: any) => {
    return s.findIndex(((v: any) => v.value === value.value)) === i
  })

  const FilterArea = () => {

    return (
      <div className='filter-unidades-area'>
        <FormControlLabel
          label="Filtre por Construtora:"
          labelPlacement='top'
          style={{ alignItems: 'flex-start' }}
          control={
            <Select
              placeholder="Escolha a Construtora"
              options={constList}
              isClearable
              value={state.construtoraSelected}
              onChange={handleConstrutoraFilterChange}
            />
          }

        />
        <FormControlLabel
          label="Filtre por Empreendimento:"
          labelPlacement='top'
          style={{ alignItems: 'flex-start' }}
          control={
            <Select
              placeholder="Escolha o Empreendimento"
              options={state.empByConstrutora}
              value={state.empreendimentoSelected}
              isClearable
              onChange={(v: any) => {
                if (!v) {
                  return dispatch({ type: 'limparEmpreendimento' })
                }
                return dispatch({ type: 'setarEmpreendimento', empreendimento: v })
              }}
            />
          }
        />
        <Button
          variant="contained"
          onClick={() => {
            setPage(1)
            _DATA.jump(1)
            dispatch({ type: 'filtrarLista', data: data })
          }}
        >
          Filtrar
        </Button>
      </div>
    )
  }

  const navigate = useNavigate()
  return (
    <>
      <Box className="contentContainer">
        <h2>Unidades</h2>
        <div className='tableContainer'>
          <div >
            <Button
              startIcon={<AddCircleOutline />}
              variant='contained' color='success'
              style={{ marginBottom: 12 }}
              onClick={() => {
                navigate('./novo')
              }}
            >
              Cadastrar
            </Button>
            <div className="filterArea">
              <FilterArea />
            </div>
          </div>
          {isLoading ? <CircularProgress /> :
            <table className='tabela'>
              <thead>
                <tr>
                  <th>Nome da Unidade</th>
                  <th>Empreendimento</th>
                  <th>Construtora</th>
                  <th>Categoria</th>
                  <th>QR Code</th>
                  <th>Ações</th>
                </tr>
              </thead>
              {_DATA?.currentData().map((unidade: IUnidade, index: number) => (
                <tr key={unidade.id}>
                  <td>
                    {unidade.nome}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>{unidade.empreendimento.nomeEmpreendimento}</span>
                    </div>
                  </td>
                  <td>
                    <span >{unidade.empreendimento.construtora.nome}</span>
                  </td>
                  <td>
                    <p
                      style={{ textAlign: 'center' }}
                      className={unidade.categoria === 0 ? 'badge' : ' badge badgeTwo'}
                    >
                      {unidade.categoria === 0 ? 'Padrao' : 'Privada'}
                    </p>
                  </td>
                  <td>
                    <div className='qrcode-wrapper'>
                      <QrCodeGenerator data={{ id: unidade.id, url: `${import.meta.env.VITE_PUBLIC_URL}/qrcode/${unidade.id}`, rest: unidade }} />
                    </div>
                  </td>
                  <td>
                    <>
                      <Link to={`./${unidade.id}`} state={unidade}>
                        <VisibilityIcon className="actionIcons green" />
                      </Link>
                      <a
                        onClick={() => handleDeleteUnidade(unidade.id)}
                      >
                        <DeleteIcon className="actionIcons red" />
                      </a>
                    </>
                  </td>
                </tr>
              ))}
            </table>
          }
          <div className="footer">
            <Pagination
              onChange={handlePageChange}
              count={numPages}
              page={page}
              shape="rounded"
            />
          </div>
        </div>
      </Box>
    </>
  )
}
