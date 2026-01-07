"use client";
import { useState, useEffect } from "react";
import File from "@/components/File";
import Document from "@/components/Document";

type Project = {
  id: number;
  name: string;
  title: string;
  video?: string;
  desc?: string;
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
      video: "https://drive.google.com/file/d/18D4xChDvpRuExwrlBO4s-F4Ni7nj8eBL/view?usp=sharing",
      desc: "The official website for Taqneeq 17.0, the annual tech fest of MPSTME, themed “Cosmic Rewind”, a retro-futuristic journey through tech, time, and creativity. This platform served as the central hub for all fest-related information, event registrations, and updates.",
      techStack: ["React", "NextJS", "TailwindCSS", "Vercel"],
      link: "https://taqneeq.vercel.app/",
    },
    {
      id: 2,
      name: "MPSTME OnTrack",
      title: "MPSTME OnTrack",
      desc: "Developed using Flutter, MPSTME OnTrack is built with an aim of never letting anyone from MPSTME get late to a lecture searching for their class. MPSTME OnTrack allows a user to store their schedule with their class details. It has inbuilt features such as floor plans and class highlighting to easily navigate through the campus with pre-lecture notifications (only Android) to make sure you reach before time.",
      techStack: ["Figma (I lead the entire UI/UX team for this)"],
      link: "https://mpstme-ontrack.netlify.app/",
    },
    {
      id: 3,
      name: "Cyber Cypher",
      title: "Cyber Cypher Website",
      video: "https://drive.google.com/file/d/1mcgnVEjHl5U4a-AFShbTXbK_v_2OVf8Q/view?usp=sharing",
      desc: "A fully themed hackathon website built for Cyber Cypher, the flagship event of Taqneeq 17.0, MPSTME’s annual tech fest. The site follows the overarching theme “Cosmic Rewind”, blending retro-futuristic visuals with modern UI/UX design and frontend development.",
      techStack: ["React", "NextJS", "TailwindCSS", "Vercel"],
      link: "https://taqneeq.vercel.app/",
    },
    {
      id: 4,
      name: "Budget Buddy",
      title: "Budget Buddy Website",
      desc: "BudgetBuddy is a full-stack personal finance web application developed during my second year, designed to simplify expense management through a clean, intuitive, and feature-rich interface. Built using HTML, Tailwind CSS, JavaScript, jQuery, and a Flask backend, the platform allows users to seamlessly track income and expenses while visualizing their financial habits through interactive graphical analytics. It integrates the Google Calendar API to map transactions to specific dates, providing a clear temporal view of spending and earnings. A smart FinBot chatbot powered via a Gemini API key assists users with financial queries and insights, enhancing engagement and usability. Additionally, the Split with Friends feature enables users to divide expenses based on custom ratios, making group expense management effortless. BudgetBuddy demonstrates strong foundational full-stack development skills, thoughtful API integration, and a practical approach to solving real-world financial tracking problems with a polished user experience.",
      techStack: ["HTML", "Flask", "TailwindCSS", "Javascript", "Supabase", "Vercel"],
      link: "https://budget-buddy-dun.vercel.app/",
    },
    {
      id: 5,
      name: "Netflix Clone",
      title: "Netflix Clone App",
      desc: "This project is a production-ready Netflix-style Android streaming application that replicates the core features of a modern OTT platform while emphasizing personalized content discovery. Built using native Android (Java) with an MVVM architecture, the app delivers a seamless user experience through secure authentication, multi-profile support, high-quality video playback with offline downloads, and polished UI/UX interactions. A key differentiating feature is the interactive swipe-based onboarding system, which captures user preferences at the start and serves as the foundation for personalized movie recommendations. The application follows a client–server architecture, integrating Firebase for authentication and data management, TMDB API for movie metadata, ExoPlayer for streaming, and a custom FastAPI backend that uses vector-based machine learning to generate intelligent, scalable recommendations, demonstrating real-world readiness and strong full-stack engineering practices.",
      techStack: ["Java - Frontend", "Python - Backend"],
      link: "https://github.com/aanchal1810/Netflix-Clone",
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);



  const handleOpen = (project: Project) => {
    if (isMobile) {
      setOpenDocs([
        {
          ...project,
          position: { top: 20, left: 0 },
        },
      ]);
      setZIndices({ [project.id]: 10 });
      setZCounter(10);
      return;
    }
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
      className="relative mt-16 flex flex-col w-[90%] md:w-[70%] items-center h-[90%] md:h-[80%] font-urbane text-brand-black shadow-[-6px_6px_0px_#2E2E2E] bg-white border-2 rounded-lg overflow-hidden"
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
      <div className="relative flex flex-col md:flex-row h-[90%] w-full gap-10 justify-center items-center overflow-hidden">

        {/* Sidebar */}
        <div className="h-[20%] md:h-[90%] flex md:flex-col mt-5 md:mt-0 items-start md:items-center w-[90%] md:w-[15%] gap-5 md:gap-3 overflow-x-auto md:overflow-y-auto snap-x snap-mandatory md:snap-none">
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-24 max-w-24 snap-start md:w-[70%] cursor-pointer"
              onClick={() => handleOpen(project)}
            >
              <File name={project.name} />
            </div>
          ))}
        </div>

        {/* Windows area */}
        <div className="relative flex-1 w-full h-full">
          {openDocs.map((doc) => (
            <div
              key={doc.id}
              className={`
    absolute
    ${isMobile
                  ? "inset-0 flex justify-center items-start pt-4"
                  : ""}
  `}
              style={{
                top: isMobile ? 0 : doc.position.top,
                left: isMobile ? 0 : doc.position.left,
                zIndex: zIndices[doc.id] || 1,
              }}
              onMouseDown={() => !isMobile && bringToFront(doc.id)}
            >

              <Document
                fileName={doc.name}
                title={doc.title}
                video={doc.video}
                desc={doc.desc}
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