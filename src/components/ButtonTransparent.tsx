import React from 'react';

const ButtonTransparent: React.FC<TButtonTransparent> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <button
      className={`${className} flex items-center bg-gray-300 bg-opacity-70 
      text-white font-bold py-4 px-4 rounded-lg shadow-md hover:bg-gray-600`}
      onClick={onClick}>
      {children}
    </button>
  );
};

type TButtonTransparent = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default ButtonTransparent;
