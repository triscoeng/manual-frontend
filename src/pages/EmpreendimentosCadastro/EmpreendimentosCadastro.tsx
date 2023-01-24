import {
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import AsyncSelect from "react-select/async"
import Select from "react-select"
import useFetchData from "../../utils/useFetchData";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import "./styles.scss";

const EmpreendimentosCadastro = () => {
  const [formState, setFormState]: any = useState({})
  const [uploadedFiles, setUploadedFiles]: any = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [construtorasData, setConstrutorasData] = useState([]);

  const [image, setImage]: any = useState();

  const companies: any = useFetchData(import.meta.env.VITE_APIURL + "/construtoras/list", 'GET')

  const handleSubmitRequest = async (data: any) => {
    // for (var pair of data.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    setIsLoading(true);
    await axios
      .post(import.meta.env.VITE_APIURL + "/empreendimentos", data, {
        headers: {
          authorization: localStorage.getItem("token") as string,
        },
      })
      .then((r) => {
        console.log(r);
        toast.success("Empreendimento cadastrado com sucesso");
        window.history.back()
      })
      .catch((err) => {
        return toast.error(err.response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitEvent = async (e: any) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("idConstrutora", formState.idConstrutora);
    formData.append("nomeEmpreendimento", formState.nomeEmpreendimento);
    formData.append("cep", formState.cep);
    if (formState.logo) {
      formData.append('logo', formState.logo)
    }
    if (formState.files) {
      formState.files.map((file: any) => formData.append("manuais", file));
    }
    try {
      await handleSubmitRequest(formData);
    } catch (error: any) {
      return toast.error(error.response);
    }
  };

  const handleFileEvent = (e: any) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const handleRemoveFileEvent = (file: any) => {
    const indexFile = uploadedFiles.findIndex((f: any) => f.name === file.name);
    console.log(indexFile);
    const newArray = [...uploadedFiles];
    newArray.splice(indexFile, 1);
    setFormState((prev: any) => (
      {
        ...prev,
        files: newArray
      }
    ))
  };

  const handleUploadFiles = (files: any) => {
    const MAX_COUNT = 6;
    const uploaded: any = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file: any) => {
      if (uploaded.findIndex((f: any) => f.name === file.name) === -1) {
        console.log(file);
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          toast.error("Você só pode incluir " + MAX_COUNT + " arquivos");
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setFormState((prev: any) => (
      {
        ...prev,
        files: uploaded
      }
    ));
  };

  const getConstrutorasData = async () => {
    await axios
      .get(import.meta.env.VITE_APIURL + "/construtoras/list", {
        headers: {
          authorization: localStorage.getItem("token") as any,
        },
      })
      .then((r: any) => {
        setConstrutorasData(r.data);
      });
  };

  useEffect(() => {
    return () => {
      setIsLoading(true);
      getConstrutorasData();
      setIsLoading(false);
    };
  }, []);

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

  const handleImageChange = useCallback(
    async (e: any) => {
      const file = e.target.files[0]
      const base64: any = await convertToBase64(file);
      setImage({ file: file, base: base64 });
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

  const handleInputChangeValue = useCallback((e: any) => {
    setFormState((prev: any) => {
      return (
        {
          ...prev,
          [e.target.id]: e.target.value
        }
      )
    })
  }, [])

  return (
    <div className="contentContainer">
      <h2>Cadastro de Empreendimento:</h2>
      <div className="tableContainer">
        <form action="#" encType="multipart/form-data">
          <FormControl fullWidth sx={{ m: 1 }}>
            <Select
              options={companies.apiData}
              styles={{
                valueContainer: () => (
                  {
                    height: '55px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '5px'
                  }),
                control: (provided: any, state: any) => {
                  return {
                    ...provided,
                    backgroundColor: '#F0F0F0',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                  }
                },
                menu: (base: any) => {
                  return {
                    ...base,
                    zIndex: 999
                  }
                }
              }}
              placeholder="Escolha a Construtora"
              onChange={(opt: any) => setFormState((prev: any) => ({ ...prev, idConstrutora: opt.value }))}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="filled">
            <InputLabel htmlFor="nomeEmpreendimento">
              Nome do Empreendimento
            </InputLabel>
            <FilledInput
              id="nomeEmpreendimento"
              onChange={handleInputChangeValue}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="filled">
            <InputLabel htmlFor="cep">CEP</InputLabel>
            <FilledInput
              id="cep"
              onChange={handleInputChangeValue}
            />
          </FormControl>
          <div className="imageArea">
            <p>Selecione o logo do empreendimento:
              <span>(Ele será usado na criação do QRCode, caso não haja será utilizado o logo da construtora.)</span>
            </p>

            {image ?
              <div className="imageArea_inner">
                <span>
                  <ClearIcon className="fileIconDelete" onClick={() => {
                    setImage(null)
                    setFormState((prev: any) => (
                      {
                        ...prev,
                        logo: null
                      }
                    ))
                  }} />
                </span>
                <img src={image.base} className="image" />
              </div>
              :
              <Button
                variant="contained"
                sx={{ m: 1 }}
                startIcon={<ImageIcon />}
                component='label'
                onChange={handleImageChange}
              >
                Imagem
                <input
                  id="imagens"
                  type="file"
                  name="image"
                  accept="image/*, png, jpeg, jpg"
                  hidden />
              </Button>
            }
          </div>
          <div className="imageArea">
            <p>Selecione todos os arquivos para este empreendimento:
              <span>Você pode enviar vários ao mesmo tempo segurando a tecla CTRL.</span>
            </p>
            <Button
              variant="contained"
              color="success"
              sx={{ m: 1 }}
              startIcon={<FilePresentIcon />}
              component='label'
              onChange={handleFileEvent}
            >
              Arquivos
              <input
                id='arquivos'
                multiple
                type="file"
                name="files"
                accept="application/pdf, application/*, richtext, plain, "
                hidden />
            </Button>
            <FormControl fullWidth sx={{ m: 1 }}>
              {formState.files ? (
                <div className="filesUploaded">
                  {formState.files.map((file: any, index: any) => (
                    <div className="file" key={index}>
                      <PictureAsPdfIcon className="fileIcon" />
                      <p className="fileText">{file.name}</p>
                      <ClearIcon
                        className="fileIconDelete"
                        onClick={() => {
                          handleRemoveFileEvent(file);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </FormControl>
          </div>
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: '12px' }}
            startIcon={
              isLoading ? <CircularProgress /> : <AddCircleRoundedIcon />
            }
            onClick={handleSubmitEvent}
          >
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmpreendimentosCadastro;
