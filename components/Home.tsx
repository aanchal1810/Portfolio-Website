"use client";
import {useRef} from 'react'
import Id from '@/components/Id';
import Skills from '@/components/Skills';

const HomePage = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col md:flex-row md:min-h-screen font-urbane text-brand-black">
      {/* ID card column: fixed 40% width; canvas is absolutely positioned inside
          so its size never depends on (or affects) the Skills column */}
      <div className="md:relative md:shrink-0 w-full md:w-2/5 md:h-auto">
        <div className="md:absolute md:inset-0">
          <Id />
        </div>
      </div>

      {/* Skills column: takes the remaining 60% */}
      <div className="w-full md:w-3/5 min-w-0">
        <Skills />
      </div>
    </div>
  )
}

export default HomePage
