"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Rnd } from "react-rnd";

type DocumentProps = {
  fileName: string;
  title: string;
  video: string;
  desc?: string;
  techStack: string[];
  link: string;
  onClose?: () => void;
  onClick?: () => void;
  zIndex?: number;
};

const Document: React.FC<DocumentProps> = ({
  fileName,
  title,
  video,
  desc,
  techStack,
  link,
  onClose,
  onClick,
  zIndex,
}) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);
const defaultWidth = isMobile ? window.innerWidth * 0.8 : 600;
const defaultHeight = isMobile ? window.innerHeight * 0.5 : 450;


  return (
    <Rnd
  key={isMobile ? "mobile" : "desktop"} 
  default={{
    x: isMobile ? window.innerWidth * 0.05 : windowSize.width / 2 - defaultWidth / 2 + 100,
    y: isMobile ? 20 : windowSize.height / 2 - defaultHeight / 2 + 165,
    width: defaultWidth,
    height: defaultHeight,
  }}
  bounds={isMobile ? "parent" : "window"}
  disableDragging={isMobile}
  enableResizing={!isMobile}
  dragHandleClassName={isMobile ? undefined : "drag-handle"}
  minWidth={isMobile ? 280 : 400}
  minHeight={300}
  style={{
    zIndex,
    position: "absolute",
  }}
  className="rounded-lg border-2 border-brand-black bg-white"
>


      {/* Header Bar */}
      <div className="drag-handle w-full flex justify-between items-center bg-brand-turqoise border-b-2 border-brand-black rounded-t-lg cursor-move px-3 py-1 text-base/tight">
        <p className="text-md font-bold">{fileName}</p>
        <X className="cursor-pointer hover:text-brand-red" onClick={onClose} />
      </div>

      {/* Content */}
      <div className="flex flex-col w-full h-[calc(100%-40px)] overflow-y-auto p-4">
        <h1 className="font-bold text-lg mb-2">{title}</h1>

        {video && (
          <video
            src={video}
            className="border-2 border-brand-black rounded-lg mb-3 w-full"
            controls
          />
        )}

        {desc && <p className="text-sm mb-3">{desc}</p>}

        {techStack && (
          <div className="mb-3">
            <h2 className="font-semibold text-md mb-1">Tech Stack:</h2>
            <ul className="list-disc list-inside">
              {techStack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        {link && (
          <div className="flex gap-2 items-center">
            <img src="/images/link.svg" alt="link" className="w-4 h-4" />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 text-sm"
            >
              {link}
            </a>
          </div>
        )}
      </div>
    </Rnd>
  );
};

export default Document;
