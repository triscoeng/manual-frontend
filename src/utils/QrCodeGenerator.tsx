import { useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { EditRounded, SaveRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const QrCodeGenerator = ({ data }: any) => {


  const navigate = useNavigate()

  const qrCode = new QRCodeStyling({
    width: 1024,
    height: 1024,
    data: process.env.REACT_APP_PUBLIC_URL + '/download/' + data.id,
    margin: 0,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 1,
      margin: 0,
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
    console.log(qrCode)
    qrCode.append(document.getElementById(data.id) as any);
  }, []);

  return (
    <>
      <div id={data.id} className="qrCode">
        <div className="qrCode_actions">
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
        </div>
      </div>
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
    </>
  );
};

export default QrCodeGenerator;
