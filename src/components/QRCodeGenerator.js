import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ qrCodeValue }) => {
  return (
    <div>
      
      <QRCode value={qrCodeValue} className='w-[50px!important] h-[50px!important]' />
    </div>
  );
};

export default QRCodeGenerator;