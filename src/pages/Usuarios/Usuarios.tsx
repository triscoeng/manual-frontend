import { useState, useEffect } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import './Usuarios.scss'
import { Add, AddBoxRounded, AddRounded, DeleteRounded, IndeterminateCheckBoxRounded, PlusOneRounded, SaveRounded } from '@mui/icons-material'
import useFetchData from '../../utils/useFetchData'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
import useQuery from '../../utils/useQuery'
import Swal from 'sweetalert2'


function Usuarios() {

  const { data: apiData, isLoading, refresh: updateList }: any = useFetchData('/usuarios')
  const [formOpen, setFormOpen] = useState(false)

  const [cadastro, setCadastro]: any = useState()
  const [deleteUser, setDeleteUser]: any = useState()

  const { post: postUser, remove: delUser, ...postState } = useQuery()

  const handleFormSubmit = async (e: any) => {
    console.log(cadastro)
    e.preventDefault();
    if (!cadastro) {
      return toast.error("Campos estão em branco")
    }
    if (!cadastro.usuario || !cadastro.senhaUsuario) {
      return toast.error("Campo de usuário ou senha estão em branco.")
    }
    const status = await postUser("/usuario", cadastro)
    if (status) {
      toast.success("Usuário cadastrado com sucesso!")
    }
    updateList()
  }

  const handleDeleteUsuario = async (e: any, id: string) => {
    e.preventDefault()
    const modal = Swal.fire({
      icon: "question",
      title: "Você deseja excluir este usuário?",
      showCancelButton: true,
      cancelButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'red',
      confirmButtonText: 'Deletar'
    })
    if ((await modal).isConfirmed) {
      const status = await delUser(`/usuario/${id}`)
      if (status) {
        toast.success("Usuário removido com sucesso!")
      }
      updateList()
    } else {
      return toast.info("Operação cancelada pelo usuário.")
    }
  }

  const inputTextChangeHandle = (e: any) => {
    e.preventDefault()
    setCadastro((prev: any) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }


  const handleFormStateChange = () => {
    setFormOpen(!formOpen)
  }

  return (
    <Box>
      <div className="contentContainer">
        <h2>Lista e Cadastro de Usuários</h2>
        <div className={`cadastro`}>
          <div className="cadastro-header">
            <h3>Cadastro:</h3>
            {!formOpen ? <AddBoxRounded onClick={handleFormStateChange} /> : <IndeterminateCheckBoxRounded onClick={handleFormStateChange} />}
          </div>
          <form onSubmit={handleFormSubmit} className={formOpen ? 'open' : ''}>
            <TextField variant="outlined" type="text" name="usuario" id="" label="Usuário" onChange={(e) => inputTextChangeHandle(e)} />
            <TextField variant="outlined" type="text" name="senhaUsuario" id="" label="Senha" onChange={(e) => inputTextChangeHandle(e)} />
            <TextField variant="outlined" type="text" name="nomeUsuario" id="" label="Nome do Usuário" onChange={(e) => inputTextChangeHandle(e)} />
            <TextField variant="outlined" type="text" name="email" id="" label="Email" onChange={(e) => inputTextChangeHandle(e)} />
            <Button variant="contained" color="success" type="submit" startIcon={<SaveRounded />}>Cadastrar</Button>
          </form>
          <div className="cadastroWrapper">
          </div>
        </div>
        <div className="lista">
          <h3>Listagem:</h3>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Nome Usuário</th>
                  <th>Email</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {
                  isLoading ?
                    <tr>
                      <td>
                        <CircularProgress />
                      </td>
                    </tr>
                    :
                    apiData.map((usuario: any) => (
                      <tr key={usuario.id}>
                        <td>{usuario.usuario}</td>
                        <td>{usuario.nomeUsuario}</td>
                        <td>{usuario.email}</td>
                        <td>
                          <DeleteRounded onClick={(e) => {
                            console.log('delete user' + usuario.id)
                            handleDeleteUsuario(e, usuario.id)
                          }} />
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="footer"></div>
      </div>
    </Box>
  )
}

export default Usuarios