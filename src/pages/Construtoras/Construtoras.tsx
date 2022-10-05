import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "../../context/LayoutContext";
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

import "./construtoras.scss";
import { Link } from "react-router-dom";
import { FilterArea } from "../../components/FilterArea";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

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

const Construtoras = () => {
  const layoutContext: any = useContext(LayoutContext);
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  // Avoid a layout jump when reaching the last page with empty rows.
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

  const getConstrutoraList = async () => {
    setLoading(true)
    await axios
      .get(`${process.env.REACT_APP_APIURL}/construtoras`, {
        headers: {
          'authorization': localStorage.getItem("token") as any,
        },
      })
      .then(({ data }) => {
        setRows(data);
        setLoading(false)
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false)
      });
  };

  const handleSingUp = async () => {
    await Swal.fire({
      title: "Cadastro de Construtora",
      confirmButtonText: "Cadastrar",
      confirmButtonColor: "green",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      focusConfirm: false,
      html: `
      <div>
        <p>Nome da Construtora</p>
        <input id="swal-construtora" class="swal2-input">
      </div>
      <div>
        <p>Nome do Contato</p>
        <input id="swal-nomeContato" class="swal2-input">
      </div>
      <div>
        <p>Email</p>
        <input id="swal-email" class="swal2-input">
      </div>
      <div>
        <p>Nome da Telefone</p>
        <input id="swal-telefone" class="swal2-input">
      </div>
      `,
      preConfirm: (e: any) => {
        const construtora = (
          document.getElementById("swal-construtora") as HTMLInputElement
        ).value;

        const nomeContato = (
          document.getElementById("swal-nomeContato") as HTMLInputElement
        ).value;
        const email = (
          document.getElementById("swal-email") as HTMLInputElement
        ).value;
        const telefone = (
          document.getElementById("swal-telefone") as HTMLInputElement
        ).value;

        return {
          nome: construtora,
          nomeContato: nomeContato,
          email: email,
          telefone: telefone,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios
            .post(
              process.env.REACT_APP_APIURL + "/construtora/add",
              result.value,
              {
                headers: {
                  authorization: localStorage.getItem("token") as any,
                },
              }
            )
            .then((r) => {
              console.log(r);
              toast.success("Cadastro realizado com sucesso");
              Swal.close();
              setUpdateTrigger(!updateTrigger);
            });
        } catch (err) {
          toast.error("Não foi possível realizar o cadastro");
        }
      } else {
        Swal.close();
      }
    });
  };

  const handleDelete = async (id: any) => {
    try {
      await axios
        .delete(process.env.REACT_APP_APIURL + "/construtora/" + id, {
          headers: {
            authorization: localStorage.getItem("token") as any,
          },
        })
        .then((r) => {
          toast.success("Construtora deletada!");
          setUpdateTrigger(!updateTrigger);
        });
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    layoutContext.setNavbar_title("Lista de Construtoras Cadastradas");
    getConstrutoraList();
  }, [updateTrigger]);





  return (
    <div className="contentContainer">
      <h2>Construtoras Cadastradas</h2>

      <div className="tableContainer">
        <Button
          variant="contained"
          startIcon={<AddCircleRoundedIcon />}
          style={{ marginBottom: "10px" }}
          onClick={handleSingUp}
        >
          Cadastrar
        </Button>
        <div className="filterWrapper">
          {rows.length > 0 ? <FilterArea setState={setRows} state={rows} /> : ''}
        </div>
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
              <TableCell align="center">Contato</TableCell>
              <TableCell align="center">Telefone</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <CircularProgress /> : ""}
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row: any) => (
              <TableRow key={row.id}>
                <TableCell align="center" component="th" scope="row">
                  {row.nome}
                </TableCell>
                <TableCell align="center">{row.nomeContato}</TableCell>
                <TableCell align="center">{row.telefone}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center" >
                  <Link to={`./${row.id}`}>
                    <VisibilityIcon className="actionIcons green" />
                  </Link>
                  <Link onClick={() => handleDelete(row.id)} to={''}>
                    <DeleteIcon className="actionIcons red" />
                  </Link>
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
                  "aria-label": "registros por página",
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
  );
};

export default Construtoras;
