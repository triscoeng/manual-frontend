import "./card.scss";
import { Link } from "react-router-dom";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import { QrCodeRounded } from "@mui/icons-material";

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
        link: "Ver Construtoras",
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
        link: "Ver Empreendimentos",
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
        span: "Quantidade de arquivos hospedados",
        link: "Ver Arquivos",
      };
      break;

    case "qrcode":
      data = {
        icon: (
          <QrCodeRounded
            className="icon"
            style={{
              color: "#2C3E50",
              backgroundColor: "#ECF0F1",
            }}
          />
        ),
        title: "QRCodes",
        span: "Quantidade de QRCodes cadastrados",
        link: "Ver os links",
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
