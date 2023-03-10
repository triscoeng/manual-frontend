import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { LayoutContext } from "../../context/LayoutContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CircularProgress from "@mui/material/CircularProgress";

import "./styles.scss";

import { Button } from "@mui/material";
import { ChevronLeft, ChevronLeftRounded, Preview, UploadFileRounded } from "@mui/icons-material";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

const ConstrutorasSingle = (props: any) => {
  const { state: construtoraData } = useLocation()
  const token: any = localStorage.getItem("token");
  const layoutContext: any = useContext(LayoutContext);

  const [editMode, setEditMode]: any = useState(true);
  const [editNewData, setEditNewData]: any = useState({});
  const [loading, setLoading]: any = useState(false);

  const [imagePreview, setImagePreview] = useState()

  const [rows, setRows] = useState(construtoraData.Empreendimentos);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditNewData((prev: any) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    [],
  )


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

  const handleImageConvert = useCallback(
    async (e: any) => {
      const file = e.target.files[0]
      const base64: any = await convertToBase64(file);
      setImagePreview(base64);
      setEditNewData((prev: any) => (
        {
          ...prev,
          image: file
        }
      ))
      e.target.value = "";
    },
    []
  )

  const handleSaveEditButton: any = async (value: any) => {
    const formData = new FormData()
    for (const key in editNewData) {
      formData.append(key, editNewData[key])
    }

    const token: any = localStorage.getItem("token");

    try {
      await axios.patch(`${import.meta.env.VITE_APIURL}/construtoras/${construtoraData.id}`, formData, {
        headers: {
          'Authorization': token
        }
      })
    } catch (error: any) {
      toast.error(error.response.data)
    }

    // if (Object.keys(formData).length > 0) {
    //   try {
    //     setLoading(true);
    //     await axios
    //       .patch(import.meta.env.VITE_APIURL + "/construtoras/" + construtoraData.id, formData, {
    //         headers: {
    //           authorization: token,
    //         },
    //       })
    //       .then((r) => {
    //         toast.success("Registro atualizado com sucesso!");
    //         setLoading(false);
    //       })
    //       .catch((error) => {
    //         toast.error("N??o foi poss??vel atualizar o registro!");
    //       });
    //   } catch (err) {
    //     setLoading(false);
    //     toast.error("N??o foi poss??vel atualizar o registro!");
    //   }
    // }
  };

  function TablePaginationActions(props: TablePaginationActionsProps) {
    const { count, page, rowsPerPage, onPageChange } = props;
    const handleBackButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page + 1);
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {<KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {<KeyboardArrowRight />}
        </IconButton>
      </Box>
    );
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  useEffect(() => {
    layoutContext.setNavbar_title(`${!editMode ? "Edi????o" : "Dados"} da Construtora: ` + construtoraData.nome.toUpperCase());
  }, [editMode]);

  return (
    <div className="construtora_single_wrapper">
      <div className="topWrapper">
        <div className="buttonArea">
          <Button
            variant="contained"
            color="success"
            startIcon={<ChevronLeft />}
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
          <Button
            disabled={loading ? true : false}
            variant={editMode ? "contained" : "outlined"}
            startIcon={editMode ? <EditRoundedIcon /> : <SaveRoundedIcon />}
            onClick={() => {
              if (editMode) {
                setEditMode(!editMode);
              } else {
                setEditMode(!editMode);
                handleSaveEditButton();
              }
            }}
          >
            {editMode ? "Editar" : "Salvar"}
          </Button>
        </div>
        <div className="inputGroup">
          <p className="inputSpan">Nome da Construtora:</p>
          <input
            name="nome"
            type="text"
            defaultValue={construtoraData.nome}
            disabled={editMode}
            onChange={handleInputChange}
          />
        </div>
        <div className="inputGroup">
          <p className="inputSpan">Nome do Contato</p>
          <input
            type="text"
            name="nomeContato"
            defaultValue={construtoraData.nomeContato}
            onChange={handleInputChange}
            disabled={editMode}
          />
        </div>
        <div className="inputGroup">
          <p className="inputSpan">Email de Cadastro</p>
          <input
            type="text"
            name="email"
            defaultValue={construtoraData.email}
            onChange={handleInputChange}
            disabled={editMode}
          />
        </div>
        <div className="inputGroup">
          <p className="inputSpan">Telefone</p>
          <input
            type="text"
            name="telefone"
            defaultValue={construtoraData.telefone}
            onChange={handleInputChange}
            disabled={editMode}
          />
        </div>
        <div className="inputGroup">
          <p className="inputSpan">Logo Construtora</p>
          <Button
            style={editMode ? { display: 'none' } : { display: 'inherit' }}
            startIcon={<UploadFileRounded />}
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
          <img src={editNewData.image ? imagePreview : import.meta.env.VITE_APIURL + '/' + construtoraData.logo} alt="Logo Construtora" />
        </div>
        {loading ? <CircularProgress /> : ""}

      </div>
      <div className="mid">
        <div className="tableContainer">
          <Table
            sx={{
              border: "1px solid rgba(224, 224, 224, 1)",
              borderRadius: "5px",
              "& .MuiTableCell-head": {
                backgroundColor: "#283268",
                color: "#fff",
              },
            }}
            aria-label="simple table"
            className="table"
            stickyHeader
          >
            <TableHead className="thead">
              <TableRow>
                <TableCell align="center">Empreendimento</TableCell>
                <TableCell align="center">CEP</TableCell>
                <TableCell align="center">A????es</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                : rows
              ).map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell align="center" component="th" scope="row">
                    {row.nomeEmpreendimento}
                  </TableCell>
                  <TableCell align="center">{row.cep}</TableCell>
                  <TableCell align="center">
                    <div className="iconGroup">
                      <Link
                        to={`../../empreendimentos/${row.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <VisibilityIcon className="actionIcons green" />
                      </Link>
                      <Link
                        to={`../../empreendimentos/${row.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <EditIcon className="actionIcons yellow" />
                      </Link>
                      <Link
                        to={`../../empreendimentos/${row.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <DeleteIcon className="actionIcons red" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "registros por p??gina",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="bot"></div>
    </div >
  );
};

export default ConstrutorasSingle;
