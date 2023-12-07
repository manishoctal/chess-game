import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ qrCodeValue }) => {
  return (
    <div>
      
      <QRCode value={qrCodeValue} />
    </div>
  );
};

export default QRCodeGenerator;