"use client";
import {useRef} from 'react'
import Id from '@/components/Id';
import Skills from '@/components/Skills';      

const HomePage = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  return (
    <div
     className="flex flex-col md:flex-row md:h-screen font-urbane text-brand-black justify-center">
        <Id />
        <Skills />
      </div>
  )
}

export default HomePage