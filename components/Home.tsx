"use client";
import React from 'react'
import Id from '@/components/Id';
import Skills from '@/components/Skills';      

const HomePage = () => {
  return (
    <div
     className="flex h-screen font-urbane text-brand-black">
        <Id />
        <Skills />
      </div>
  )
}

export default HomePage