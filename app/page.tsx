import Image from "next/image";
import Navbar from "@/components/Navbar";
import Id from "@/components/Id";
import Skills from "@/components/Skills"; 
import HomePage from "@/components/Home";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        <HomePage />
        <Projects />
      </div>
    </div>
    
  );
}
