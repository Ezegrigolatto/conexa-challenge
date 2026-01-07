import React from 'react';

interface LoaderProps {
  className?: string;
}
const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center relative ${className}`}>
      <div
        className={`w-5 h-5 border-2 border-t-transparent border-background rounded-full animate-spin duration-500`}
      ></div>
    </div>
  );
};

export default Loader;
