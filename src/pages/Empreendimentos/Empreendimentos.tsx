import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "../../context/LayoutContext";
import "./styles.scss";

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
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { toast } from "react-toastify";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Empreendimentos = () => {
  const layoutContext: any = useContext(LayoutContext);
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const getEmpreendimentosData = async () => {
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_APIURL + "/empreendimentos", {
        headers: {
          authorization: localStorage.getItem("token") as string,
        },
      })
      .then(async (r) => {
        setIsLoading(false);
        setRows(r.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteRow = async (id: any) => {
    Swal.fire({
      title: "Confirmação de Exclusão!",
      icon: "question",
      html: "Ao excluir este registo os arquivos <strong> também serão removidos.</strong> <br> Esta ação não poderá ser desfeita! Você tem certeza disto?",
      confirmButtonText: "DELETAR",
      confirmButtonColor: "red",
      showCancelButton: true,
      cancelButtonText: "CENCELAR",
      cancelButtonColor: "gray",
    }).then((r: any) => {
      if (r.isConfirmed) {
        setIsLoading(true);
        axios
          .delete(process.env.REACT_APP_APIURL + "/empreendimento/" + id, {
            headers: {
              authorization: localStorage.getItem("token") as any,
            },
          })
          .then(() => {
            toast.success("Registro excluído com sucesso");
            setTrigger(!trigger);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            toast.error(err.message);
          });
      }
    });
  };

  useEffect(() => {
    layoutContext.setNavbar_title("Lista de Empreendimentos");
    getEmpreendimentosData();
    return () => {};
  }, [trigger]);

  const handleSingUp = () => {
    navigate("./cadastro");
  };

  return (
    <div className="empreendimentosContainer">
      <h2>Empreendimentos Cadastrados</h2>
      <div className="tableContainer">
        <Button
          variant="contained"
          startIcon={<AddCircleRoundedIcon />}
          style={{ marginBottom: "10px" }}
          onClick={handleSingUp}
        >
          Cadastrar
        </Button>
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
              <TableCell align="center">Construtora</TableCell>
              <TableCell align="center">Empreendimento</TableCell>
              <TableCell align="center">Quantidade de Arquivos</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <CircularProgress />
          ) : (
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
                    {row.construtora.nome}
                  </TableCell>
                  <TableCell align="center">{row.nomeEmpreendimento}</TableCell>
                  <TableCell align="center">{row.Arquivos.length}</TableCell>
                  <TableCell align="center">
                    <>
                      {/* <Link to={`./${row.id}`} style={{ textDecoration: "none" }}>
                      <VisibilityIcon className="actionIcons green" />
                    </Link> */}
                      <Link to={`./${row.id}`}>
                        <VisibilityIcon className="actionIcons green" />
                      </Link>
                      <span
                        onClick={() => {
                          handleDeleteRow(row.id);
                        }}
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
                  </TableCell>
                </TableRow>
              ))}
              {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "registros por página",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            /> */}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default Empreendimentos;
