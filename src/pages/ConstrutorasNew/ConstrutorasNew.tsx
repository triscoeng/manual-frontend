import React, { useCallback, useState } from 'react'
import { Button, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

import './construtoranew.scss'
import { useNavigate, useNavigation } from 'react-router-dom';


const ConstrutorasNew = () => {

  const navigate = useNavigate()
  const formData = new FormData()
  const [image, setImage]: any = React.useState();
  const [formState, setFormState]: any = React.useState();
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      formData.append('nome', formState.nome)
      formData.append('nomeContato', formState.nomeContato)
      formData.append('email', formState.email)
      formData.append('telefone', formState.telefone)
      formData.append('image', formState.logo)
      await axios.post(import.meta.env.VITE_APIURL + '/construtoras', formData, {
        headers: {
          'authorization': localStorage.getItem('token') as any
        }
      }).then(async (r) => {
        setTimeout(() => {
          if (r.status === 201) {
            toast.success("Construtora cadastrada com sucesso.")
            navigate('../')
          } else {
            console.log(r)
            toast.error("Não foi possível cadastrar a construtora. Tente novamente!")
          }
          setIsLoading(false)
          return
        }, 5000)
      })
    } catch (error) {
      toast.error("Não foi possível cadastrar a construtora. Confira os dados digitados e tente novamente")
      setIsLoading(false)
    }
  }

  const handleImageConvert = useCallback(
    async (e: any) => {
      const file = e.target.files[0]
      const base64 = await convertToBase64(file);
      setImage(base64);
      setFormState((prev: any) => (
        {
          ...prev,
          logo: file
        }
      ))
      e.target.value = "";
    },
    []
  )

  const handleInputValue = (e: any) => {
    setFormState((prev: any) => (
      {
        ...prev,
        [e.target.name]: e.target.value
      }
    ))
  }


  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if (!file) {
        alert("Please select an image");
      } else {
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
      }
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const deleteImage = (e: any) => {
    e.preventDefault();
    setImage(null);
  };



  return (
    <div className="form">
      <div className="construtoraNew-cadastro">
        <div>
          <h2>Cadastro de Construtora:</h2>
          <form onSubmit={handleFormSubmit} action="" method="post" encType="multipart/form-data" className='form'>
            <FormControl>
              <TextField label="Nome da Construtora" name="nome" id="nome" variant="filled" onChange={handleInputValue} />
            </FormControl>
            <FormControl>
              <TextField label="Contato" name="nomeContato" id="nomeContato" variant="filled" onChange={handleInputValue} />
            </FormControl>
            <FormControl>
              <TextField label="Email" name="email" id="email" variant="filled" onChange={handleInputValue} />
            </FormControl>
            <FormControl>
              <TextField name="telefone" label="Telefone" id="telefone" variant="filled" onChange={handleInputValue} />
            </FormControl>
            <FormControl>
              <Button
                startIcon={<UploadFileIcon />}
                variant="contained"
                component="label"
                onChange={handleImageConvert}
              >
                Logotipo da Empresa
                <input
                  type="file"
                  name="image"
                  accept="image/*, png, jpeg, jpg"
                  hidden
                />
              </Button>
            </FormControl>
            <FormControl>
              <div className='preview'>
                {
                  image ?
                    <img src={image} />
                    :
                    <p>Nenhum arquivo enviado.</p>
                }

              </div>
            </FormControl>
            <Button type="submit" variant='contained' disabled={isLoading ? true : false}
              startIcon={isLoading ? <CircularProgress /> : <SaveOutlinedIcon />}
            >
              Cadastrar
            </Button>
          </form>
        </div>
        <div>
        </div>
      </div>
    </div >
  )
}

export default ConstrutorasNew