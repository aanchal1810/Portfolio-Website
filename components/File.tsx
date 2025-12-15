"use client";
import React from "react";

type FileProps = {
  name: string;
  onClick?: () => void;
};

const File: React.FC<FileProps> = ({ name, onClick }) => {
  return (
    <div className="flex flex-col gap-2 cursor-pointer" onClick={onClick}>
      <img
        src="/images/File.svg"
        className="w-full h-full object-cover"
        alt="File icon"
      />
      <p className="font-spline text-center text-base/tight text-wrap">
        {name}
      </p>
    </div>
  );
};

export default File;
