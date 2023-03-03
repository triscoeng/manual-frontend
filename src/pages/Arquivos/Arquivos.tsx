import axios from 'axios'
import { useEffect, useReducer, useState, useContext } from 'react'
import useFetchData from '../../utils/useFetchData';
import { LayoutContext } from '../../context/LayoutContext'
import { EditRounded, Save } from '@mui/icons-material'
import { Button, CircularProgress, FormControlLabel, Icon, Pagination } from '@mui/material'
import { toast } from 'react-toastify'
import Select from 'react-select';

import './Arquivos.scss';
import usePagination from '../../utils/usePagination';



const Arquivos = () => {
  const { data: arquivos, isLoading }: any = useFetchData('/arquivos')
  const [filterData, setFilterData] = useState([])
  const layoutContext: any = useContext(LayoutContext);


  useEffect(() => {
    layoutContext.setNavbar_title("Lista de Arquivos");
  }, [])

  function reducer(state: any, action: any) {
    switch (action.type) {
      case 'setarConstrutora':
        const empList = arquivos.map((arquivo: any) => ({ label: arquivo.empreendimento.nomeEmpreendimento, value: arquivo.empreendimento.id, parent: arquivo.empreendimento.construtora.id })).filter(((emp: any) => emp.parent === action.construtora.value)).filter((v: any, i: any, array: any) => {
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

  const [updatedFileName, setUpdatedFileName]: any = useState([])
  const [inputEnable, setInputEnable]: any = useState([])

  //pagination
  const [page, setPage] = useState(1)
  const per_page = 15
  const numPages = Math.ceil((filterData?.length > 0 ? filterData?.length : arquivos?.length) / per_page)
  const _DATA = usePagination(filterData?.length > 0 ? filterData : arquivos, per_page)

  if (isLoading) {
    return <CircularProgress />
  }

  const constList = arquivos.map((arquivo: any) => ({ label: arquivo.empreendimento.construtora.nome, value: arquivo.empreendimento.construtora.id })).filter((value: any, i: number, s: any) => {
    return s.findIndex(((v: any) => v.value === value.value)) === i
  })

  const handleDisabledInputClick = async (e: any, file: any) => {
    e.preventDefault()
    setInputEnable(file.id)
    if (inputEnable.indexOf(file.id) > -1) {

      try {
        const file = await axios.patch(`${import.meta.env.VITE_APIURL}/arquivo/${updatedFileName.id}`, { nomeExibicao: updatedFileName.nomeExibicao })
        setInputEnable([])
        return toast.success("Nome do arquivo alterado!")
      } catch (error: any) {
        toast.error(error.message)
      }
    } else {
      setInputEnable(file.id)
    }
  }

  const handleSaveIconBtnHandle = () => {
    // setInputEnable(null)
  }

  const handleInputChange = (file: any, e: any) => {
    setUpdatedFileName({ id: file.id, nomeExibicao: e.target.value })
  }

  const handleConstrutoraFilterChange = (v: any) => {
    if (!v) {
      return dispatch({ type: 'limparConstrutora' })
    }
    return dispatch({ type: 'setarConstrutora', construtora: v })
  }

  const FilterArea = () => {

    return (
      <div className='filter-arquivos-area'>
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
              onChange={(v) => {
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
            dispatch({ type: 'filtrarLista', data: arquivos })
          }}
        >
          Filtrar
        </Button>
      </div>
    )
  }

  const handlePageChange = (e: any, p: any) => {
    e.preventDefault()
    setPage(p)
    _DATA.jump(p)
  }


  return (
    <div id="files" className='contentContainer '>
      <h2>Lista de Arquivos para edição:</h2>
      <div className='header'>
        <FilterArea />
      </div>
      <div className='content'>
        <table className='tabela' style={{ gridTemplateColumns: "repeat(5, auto)" }}>
          <thead>
            <tr>
              <th>Nome Exibição</th>
              <th>Empreendimento</th>
              <th>Construtora</th>
              <th>Qtde Downloads</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              _DATA?.currentData().map((arquivo: any, index: number) => {
                return (
                  <tr key={arquivo.id}>
                    <td>
                      <input
                        type="text"
                        name="nomeExibicao"
                        id={"nomeExibicao#" + index}
                        className='nomeExibicao'
                        disabled={inputEnable.indexOf(arquivo.id) ? true : false}
                        defaultValue={arquivo.nomeExibicao}
                        onChange={(e) => handleInputChange(arquivo, e)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p>{arquivo.empreendimento.nomeEmpreendimento}</p>
                      </div>
                    </td>
                    <td>
                      <p>{arquivo.empreendimento.construtora.nome}</p>
                    </td>
                    <td>
                      <p>{arquivo.quantidadeDownload}</p>
                    </td>
                    <td>
                      <>
                        <span onClick={(e) => handleDisabledInputClick(e, arquivo)}>
                          {!inputEnable.indexOf(arquivo.id) ? <Save className="actionIcons blue" onClick={handleSaveIconBtnHandle} /> : <EditRounded className="actionIcons green" />}
                        </span>
                      </>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <div className="footer">
        <Pagination
          onChange={handlePageChange}
          count={numPages}
          page={page}
          shape="rounded"
        />
      </div>
    </div>
  )
}

export default Arquivos