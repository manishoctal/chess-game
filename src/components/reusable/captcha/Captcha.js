import React, { useRef, useEffect, useState } from 'react';
import { IoIosRefresh } from "react-icons/io";

const Captcha = ({ onChange }) => {
  const canvasRef = useRef(null);
  const captchaTextRef = useRef('');

  const [isRotating, setIsRotating] = useState(false);
  const generateRandomBytes = (length) => {
    const buffer = new Uint8Array(length);
    window.crypto.getRandomValues(buffer);
    return buffer;
  };

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captchaText = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = generateRandomBytes(1)[0] % chars.length;
      captchaText += chars.charAt(randomIndex);
    }

    captchaTextRef.current = captchaText;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '25px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(captchaText, 10, 30);

    if (onChange) {
      onChange(captchaText);
    }
  };
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleClick = () => {
    setIsRotating(true);
    generateCaptcha()
    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
  };
  return (
    <div className='text-center flex items-center  justify-center  mb-4'>
      <canvas ref={canvasRef} width="150" height="40" className=' bg-slate-300'/>
      <div onClick={handleClick} className="flex items-center cursor-pointer">
      <IoIosRefresh className={`text-2xl ml-2 ${isRotating ? 'rotate' : ''}`} />
    </div>
    </div>
  );
};

export default Captcha;