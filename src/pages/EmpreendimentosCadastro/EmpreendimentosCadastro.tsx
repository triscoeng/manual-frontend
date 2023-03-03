import {
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import Select from "react-select"
import useFetchData from "../../utils/useFetchData";
import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import "./styles.scss";
import { useLocation, useParams } from "react-router-dom";
import { SaveOutlined } from "@mui/icons-material";
import { LayoutContext } from "../../context/LayoutContext";

const EmpreendimentosCadastro = () => {
  let { state: editModeData } = useLocation()
  // let { data: editModeData, isLoading, refresh, isError, isSuccess } = useFetchData(`/empreendimento/${id}`)
  const [editMode, setEditMode] = useState(editModeData ? true : false)

  const construtoraData: any = useFetchData('/construtoras/list')
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage]: any = useState();

  const [formState, setFormState]: any = useState(editMode ?
    {
      ...editModeData
    }
    : {}
  )

  const [editState, setEditState] = useState({})

  const [removeFiles, setRemoveFiles]: any = useState()
  // const [uploadedFiles, setUploadedFiles]: any = useState(editMode ? editModeData.Arquivos : []);
  const [fileLimit, setFileLimit] = useState(false);



  const handleSubmitRequest = async (data: any) => {
    // for (var pair of data.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    setIsLoading(true);
    switch (editMode) {
      case true:
        console.log("MODO EDIT")
        await axios
          .patch(import.meta.env.VITE_APIURL + "/empreendimento/" + editModeData.id, data, {
            headers: {
              authorization: localStorage.getItem("token") as string,
            },
          })
          .then((r) => {
            return toast.success("Empreendimento editado com sucesso");
            window.history.back()
          })
          .catch((err) => {
            return toast.error(err.response.data);
          })
          .finally(() => {
            setIsLoading(false);
          });
        break;
      default:
        await axios
          .post(import.meta.env.VITE_APIURL + "/empreendimentos", data, {
            headers: {
              authorization: localStorage.getItem("token") as string,
            },
          })
          .then((r) => {
            return toast.success(`Empreendimento cadastrado com sucesso!`);
            // window.history.back()
          })
          .catch((err) => {
            return toast.error(err.response.data);
          })
          .finally(() => {
            setIsLoading(false);
          });
        break;
    }
  };

  const handleSubmitEvent = async (e: any) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("idConstrutora", editMode ? editModeData.idConstrutora : formState.idConstrutora);
    formData.append("id", editMode ? editModeData.id : formState.id);
    formData.append("nomeEmpreendimento", editMode ? editModeData.nomeEmpreendimento : formState.nomeEmpreendimento);
    formData.append("cep", editMode ? editModeData.cep : formState.cep);
    { editMode ? formData.append("Arquivos[]", JSON.stringify(editModeData.Arquivos)) : null }
    if (image) {
      formData.append("logo", formState.logo)
    } else {
      formData.append("logo", editMode ? editModeData.logo : '');
    }
    if (formState.Arquivos?.length > 0) {
      for (var file of formState.Arquivos) {
        if (file instanceof File) {
          formData.append('manuais', file, file.name)
        }
      }
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
    const indexFile = !editMode ? formState.Arquivos.findIndex((f: any) => f.name === file.name) :
      formState.Arquivos.findIndex((f: any) => f.id === file.id)
    const newArray = [...formState.Arquivos];
    newArray.splice(indexFile, 1);
    if (editMode) {
      editModeData.Arquivos = newArray
    }
    setFormState((prev: any) => (
      {
        ...prev,
        Arquivos: newArray
      }
    ))
  };

  const handleUploadFiles = (files: any) => {
    const MAX_COUNT = 6;
    const uploaded: any = !formState.Arquivos ? [] : [...formState.Arquivos];
    let limitExceeded = false;
    files.some((file: any) => {
      if (uploaded.findIndex((f: any) => f.name === file.name) === -1) {
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
        Arquivos: uploaded
      }
    ));
  };

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
    if (!editMode) {
      setFormState((prev: any) => {
        return (
          {
            ...prev,
            [e.target.id]: e.target.value
          }
        )
      })
    }
    else {
      editModeData[e.target.id] = e.target.value
    }
  }, [])

  const handleInputSelectChange = (e: any, opt: any) => {
    switch (opt.action) {
      case 'select-option':
        setFormState((prev: any) => ({
          ...prev,
          [opt.name]: e.value
        }))
        break;
    }
  }
  const layoutContext: any = useContext(LayoutContext)

  useEffect(() => {
    editMode ?
      layoutContext.setNavbar_title(`Tela de Edição do Empreendimento: ${editModeData.nomeEmpreendimento}`)
      :
      layoutContext.setNavbar_title(`Tela de Cadastro de Empreendimento`)
  }, [])

  useEffect(() => {
    console.log(editModeData)
  }, [editModeData])


  return (
    <div className="contentContainer">
      <h2>Cadastro de Empreendimento:</h2>
      <div className="tableContainer">
        {
          (construtoraData.isLoading) ?
            <CircularProgress />
            :
            <form action="#" encType="multipart/form-data">
              <FormControl fullWidth sx={{ m: 1 }}>
                <Select
                  isDisabled={editMode ? true : false}
                  name="idConstrutora"
                  options={construtoraData.data}
                  defaultValue={editMode ? construtoraData?.data.filter((v: any) => v.value === editModeData.idConstrutora) : null}
                  placeholder="Escolha a Construtora"
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
                  onChange={(e, opt) => handleInputSelectChange(e, opt)}
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                <InputLabel htmlFor="nomeEmpreendimento">
                  Nome do Empreendimento
                </InputLabel>
                <FilledInput
                  id="nomeEmpreendimento"
                  defaultValue={editMode ? editModeData.nomeEmpreendimento : null}
                  onChange={handleInputChangeValue}
                  onFocus={(e) => console.log({ [e.target.id]: e.target.value })}
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                <InputLabel htmlFor="cep">CEP</InputLabel>
                <FilledInput
                  id="cep"
                  defaultValue={editMode ? editModeData.cep : null}
                  onChange={handleInputChangeValue}
                />
              </FormControl>
              <div className="imageArea">
                <p>Selecione o logo do empreendimento:
                </p>
                {(image || editModeData?.logo) ?
                  <div className="imageArea_inner">
                    <span>
                      <ClearIcon className="fileIconDelete" onClick={() => {
                        setImage(null)
                        if (!editMode) {
                          setFormState((prev: any) => (
                            {
                              ...prev,
                              logo: ''
                            }
                          ))
                        } else {
                          console.log(editModeData)
                          editModeData.logo = ''
                        }
                      }} />
                    </span>
                    <img src={image ? image.base : `${import.meta.env.VITE_APIURL}/${formState.logo}`} className="image" />
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
                  {formState.Arquivos ? (
                    <div className="filesUploaded">
                      {formState.Arquivos.map((file: any, index: any) => {
                        const isFile = file instanceof File
                        return (
                          <div className="file" key={index}>
                            <PictureAsPdfIcon className="fileIcon" />
                            <p className="fileText">{isFile ? file.name : file.nomeExibicao}</p>
                            <ClearIcon
                              className="fileIconDelete"
                              onClick={() => {
                                handleRemoveFileEvent(file);
                              }}
                            />
                          </div>
                        )
                      })}
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
                  isLoading ? <CircularProgress /> : editMode ? <SaveOutlined /> : <AddCircleRoundedIcon />
                }
                onClick={handleSubmitEvent}
              >
                {editMode ? 'Editar' : 'Cadastrar'}
              </Button>
            </form>
        }
      </div>
    </div>
  );
};

export default EmpreendimentosCadastro;
