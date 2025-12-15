"use client";
import { useState, useEffect } from "react";
import File from "@/components/File";
import Document from "@/components/Document";

type Project = {
  id: number;
  name: string;
  title: string;
  video: string;
  techStack: string[];
  link: string;
};

type Position = {
  top: number;
  left: number;
};

type OpenDoc = Project & {
  position: Position;
};

type ZIndexMap = Record<number, number>;

const AanchalOS = () => {
  const [openDocs, setOpenDocs] = useState<OpenDoc[]>([]);
  const [zIndices, setZIndices] = useState<ZIndexMap>({});
  const [zCounter, setZCounter] = useState<number>(1);

  const projects: Project[] = [
    {
      id: 1,
      name: "Taqneeq Fest",
      title: "Taqneeq Fest Website",
      video: "/videos/taqneeq_mainfest.mp4",
      techStack: ["React", "NextJS", "TailwindCSS", "Vercel"],
      link: "https://taqneeq.vercel.app/",
    },
    {
      id: 2,
      name: "MPSTME OnTrack",
      title: "MPSTME OnTrack Website",
      video: "/videos/taqneeq_mainfest.mp4",
      techStack: ["React", "NextJS", "TailwindCSS", "Vercel"],
      link: "https://taqneeq.vercel.app/",
    },
    {
      id: 3,
      name: "Cyber Cypher",
      title: "Cyber Cypher Website",
      video: "/videos/taqneeq_mainfest.mp4",
      techStack: ["React", "NextJS", "TailwindCSS", "Vercel"],
      link: "https://taqneeq.vercel.app/",
    },
    {
      id: 4,
      name: "Budget Buddy",
      title: "Budget Buddy App",
      video: "/videos/taqneeq_mainfest.mp4",
      techStack: ["React", "NextJS", "TailwindCSS", "Vercel"],
      link: "https://taqneeq.vercel.app/",
    },
    {
      id: 5,
      name: "Netflix Clone",
      title: "Netflix Clone App",
      video: "/videos/taqneeq_mainfest.mp4",
      techStack: ["React", "NextJS", "TailwindCSS", "Vercel"],
      link: "https://taqneeq.vercel.app/",
    },
  ];

  useEffect(() => {
    const first = projects[0];

    setOpenDocs([
      {
        ...first,
        position: { top: 80, left: 300 },
      },
    ]);

    setZIndices({ [first.id]: 2 });
    setZCounter(2);
  }, []);

  
  const handleOpen = (project: Project) => {
    setOpenDocs((prev) => {
      const existing = prev.find((doc) => doc.id === project.id);

      if (existing) {
        bringToFront(project.id);
        return prev;
      }

      const offset = prev.length * 30;
      const newDoc: OpenDoc = {
        ...project,
        position: {
          top: 80 + offset,
          left: 300 + offset,
        },
      };

      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      setZIndices((prevZ) => ({ ...prevZ, [project.id]: nextZ }));

      return [...prev, newDoc];
    });
  };

  const handleClose = (id: number) => {
    setOpenDocs((prev) => prev.filter((doc) => doc.id !== id));

    setZIndices((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const bringToFront = (id: number) => {
    setZCounter((prev) => {
      const newZ = prev + 1;
      setZIndices((prevZ) => ({ ...prevZ, [id]: newZ }));
      return newZ;
    });
  };

  return (
    <div
      className="relative flex flex-col w-[70%] items-center h-[80%] font-urbane text-brand-black shadow-[-6px_6px_0px_#2E2E2E] bg-white border-2 rounded-lg overflow-hidden"
      style={{ boxShadow: "-6px 6px 0px 0px #2E2E2E" }}
    >
      {/* Header */}
      <div className="w-full h-[10%] flex items-center justify-between bg-brand-lavendar rounded-t-lg border-b-2 border-brand-black">
        <div className="flex gap-3 ml-5">
          <div className="h-5 w-5 border border-brand-black bg-brand-blue rounded-full"></div>
          <div className="h-5 w-5 border border-brand-black bg-brand-red rounded-full"></div>
          <div className="h-5 w-5 border border-brand-black bg-brand-purple rounded-full"></div>
        </div>
        <h1 className="text-end mr-5 text-2xl font-spline font-semibold">Projects</h1>
      </div>

      {/* Body */}
      <div className="flex h-[90%] w-full gap-10 justify-center items-center relative">
        {/* Sidebar */}
        <div className="h-[90%] flex flex-col items-center w-[15%] gap-3 overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-[70%] cursor-pointer"
              onClick={() => handleOpen(project)}
            >
              <File name={project.name} />
            </div>
          ))}
        </div>

        {/* Windows area */}
        <div className="relative flex-1 h-full">
          {openDocs.map((doc) => (
            <div
              key={doc.id}
              className="absolute"
              style={{
                top: doc.position.top,
                left: doc.position.left,
                zIndex: zIndices[doc.id] || 1,
              }}
              onMouseDown={() => bringToFront(doc.id)}
            >
              <Document
                fileName={doc.name}
                title={doc.title}
                video={doc.video}
                techStack={doc.techStack}
                link={doc.link}
                onClose={() => handleClose(doc.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AanchalOS;