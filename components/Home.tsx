"use client";
import React from 'react'
import Id from '@/components/Id';
import Skills from '@/components/Skills';      

const HomePage = () => {
  return (
    <div
     className="flex flex-col md:flex-row h-screen font-urbane text-brand-black justify-center">
        <Id />
        <Skills />
      </div>
  )
}

export default HomePage