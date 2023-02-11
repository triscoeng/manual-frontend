import React from 'react'
import { AddCircleOutline, ContentCopy } from '@mui/icons-material'
import { Button, CircularProgress, Icon } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import QrCodeGenerator from '../../utils/QrCodeGenerator'
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LayoutContext } from '../../context/LayoutContext'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

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

  const [isLoading, setIsLoading] = useState()
  const [unidadesList, setUnidadesList] = useState([])
  const [trigger, setTrigger]: any = useState()
  const layoutContext: any = React.useContext(LayoutContext);

  async function getUnidadesList() {
    await axios.get(import.meta.env.VITE_APIURL + '/unidades', {
      headers: {
        'Authorization': localStorage.getItem('token') as any
      }
    }).then(({ data }) => {
      setUnidadesList(data)
    })
  }

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
        setTrigger(!trigger)
      })
    } else {
      toast.info("Operação Cancelada")
    }
  }

  useEffect(() => {
    setIsLoading(true)
    layoutContext.setNavbar_title("Lista de Unidades Cadastradas");
    getUnidadesList().finally(() => setIsLoading(false))

  }, [trigger])

  const navigate = useNavigate()
  return (
    <>
      <div className="contentContainer">
        <h2>Unidades</h2>
        <div className='tableContainer'>
          <div className="filterArea">
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
              {unidadesList &&
                unidadesList.map((unidade: IUnidade, index: number) => (
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
                      <div className=''>
                        <QrCodeGenerator data={{ id: unidade.id, url: `${import.meta.env.VITE_PUBLIC_URL}/qrcode/${unidade.id}`, rest: unidade }} />
                      </div>
                    </td>
                    <td>
                      <>
                        <Link to={`./${unidade.id}`} state={unidade}>
                          <VisibilityIcon className="actionIcons green" />
                        </Link>
                        <span
                          onClick={() => handleDeleteUnidade(unidade.id)}
                        >
                          <DeleteIcon className="actionIcons red" />
                        </span>
                        {/* <Button
                        onClick={() => navigate(`./${row.id}`)}
                        startIcon={
                          <VisibilityIcon className="actionIcons green" />
                        }
                      />
                      <Button
                        //   onClick={() => handleDelete(row.id) as any}
                        startIcon={<DeleteIcon className="actionIcons red" />}
                      /> */}
                      </>
                    </td>
                  </tr>
                ))}
            </table>
          }
        </div>
      </div>
    </>
  )
}
