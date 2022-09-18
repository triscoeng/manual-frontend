import { useEffect } from "react";
import QRCodeStyling from "qr-code-styling";

const QrCodeGenerator = ({ data }: any) => {
  console.log(
    process.env.REACT_APP_ROOT_URL + `/download/id=${data.id}&hash=${data.hash}`
  );
  const qrCode = new QRCodeStyling({
    width: 450,
    height: 450,
    data:
      process.env.REACT_APP_ROOT_URL +
      `/download/id=${data.id}&hash=${data.hash}`,
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
    qrCode.append(document.getElementById("qrCode") as any);
  }, []);

  return (
    <>
      <div id="qrCode"></div>

      <button
        onClick={() => {
          qrCode.download({
            name: "QRCODE_" + data.nomeArquivo,
            extension: "png",
          });
        }}
      >
        Download do QRCode
      </button>
    </>
  );
};

export default QrCodeGenerator;
