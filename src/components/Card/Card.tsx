import "./card.scss";
import { Link } from "react-router-dom";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";

const Card = ({ title, dados }: any) => {
  let data: any = {};

  switch (title) {
    case "construtoras":
      data = {
        icon: (
          <ApartmentRoundedIcon
            className="icon"
            style={{
              color: "#2C3E50",
              backgroundColor: "#ECF0F1",
            }}
          />
        ),
        title: "Construtoras",
        span: "Quantidade de construtoras cadastradas",
        link: "Ver todas Construtoras",
      };
      break;
    case "empreendimentos":
      data = {
        icon: (
          <AddBusinessRoundedIcon
            className="icon"
            style={{
              color: "#2C3E50",
              backgroundColor: "#ECF0F1",
            }}
          />
        ),
        title: "Empreendimentos",
        span: "Quantidade de empreendimentos cadastrados",
        link: "Ver todos Empreendimentos",
      };
      break;
    case "arquivos":
      data = {
        icon: (
          <FilePresentRoundedIcon
            className="icon"
            style={{
              color: "#2C3E50",
              backgroundColor: "#ECF0F1",
            }}
          />
        ),
        title: "Arquivos",
        span: "Quantidade de donwloads",
        link: "Ver todos Arquivos",
      };
      break;

    default:
      break;
  }

  return (
    <div className={`card ${title}`}>
      <div className="card-container">
        <div>
          <p className="title">{data.title}</p>
          <span className="title span">{data.span}</span>
        </div>
        <div className="card-content">
          <p>{dados}</p>
        </div>
        <div className="card-footer">
          <Link to={`./${title}`} style={{ textDecoration: "none" }}>
            {data.link}
          </Link>
          {data.icon}
        </div>
      </div>
    </div>
  );
};

export default Card;
