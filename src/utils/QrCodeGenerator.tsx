import { useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { EditRounded, SaveRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import "./QrCodeGenerator.scss"

const QrCodeGenerator = ({ data }: any) => {

  console.log(data)
  const navigate = useNavigate()
  const qrCode = new QRCodeStyling({
    width: 1024,
    height: 1024,
    image: import.meta.env.VITE_APIURL + "/" + data.rest.empreendimento.construtora.logo,
    data: import.meta.env.VITE_PUBLIC_URL + '/qrcode/' + data.id,
    margin: 0,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      margin: 20,
    },
    dotsOptions: {
      type: "extra-rounded",
      color: "#0001a4",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000066",
    },
    cornersDotOptions: {
      color: "#000066",
    },
  });

  useEffect(() => {
    qrCode.append(document.getElementById(data.id) as any);
  }, []);

  return (

    <div id={data.id} className="qrCode">
      <span onClick={() => {
        qrCode.download({
          name: "QRCODE_" + data.url,
          extension: "jpeg"
        })
      }}>
        <SaveRounded />
      </span>
      {/* <div className="qrCode_actions">
          <span className="edit" onClick={() => navigate(`./${data.id}`, { state: data })}>
            <EditRounded />
          </span>
          <span className="download" onClick={() => {
            qrCode.download({
              name: "QRCODE_" + data.url,
              extension: "jpeg"
            })
          }}>
            <SaveRounded />
          </span>
        </div> */}
      {/* <button
        onClick={() => {
          qrCode.download({
            name: "QRCODE_" + data.url,
            extension: "png",
          });
        }}
      >
        Download do QRCode
      </button> */}
    </div>
  );
};

export default QrCodeGenerator;
