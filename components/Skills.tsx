import React from 'react'

const Skills = () => {
  return (
    <section className="flex justify-center items-center h-full font-urbane text-brand-black">
      {/* div for mt-20 */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center mt-0 md:mt-20 gap-10 md:gap-3">
        {/* ID Card */}
        {/* <div>
          <img
            src="/IDCard.svg"
            alt=""
            width={290}
            className="-rotate-3 mt-10 md:-mt-5"
          />
        </div> */}
        {/* div for all the blocks: intro, skills edu */}
        <div className="flex flex-col gap-7 justify-center md:justify-normal lg:justify-center mt-0 md:mt-8 items-center w-full h-full md:w-[75%]">
          {/* intro block */}
          <div className="w-[75%] md:w-[90%] relative">
            <div
              className="w-full border-2 bg-white border-brand-black  p-4 rounded-lg drop-shadow-2xl"
              style={{
                boxShadow: "-6px 6px 0px 0px #2E2E2E",
                filter: 'none'
              }}
            >
              <p className="font-urbane">
                Hello! I’m Aanchal Shah, a second year engineering student. I
                love designing clean, modern interfaces and I know how to bring
                them to life with code. I’m also a quick learner.
              </p>
            </div>
            <img
              src="/images/Sparkle.svg"
              alt=""
              className="absolute top-0 -right-7"
            />
          </div>
          {/* Bottom two containers for skills and education */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10">
            {/* Skills Block */}
            <div className="w-[75%] lg:w-[40%] relative">
              {/* Main Block */}
              <div className="w-full border-2 border-brand-black p-4 rounded-lg bg-white flex flex-col gap-2">
                <h1 className="font-bold text-lg">Skills:</h1>
                <ul className="space-y-2">
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Frontend: </span>
                    React, Vite, HTML, TailwindCSS, JavaScript, Angular, NextJS
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Backend: </span>
                    Python, C++, C, MySQL, Python, Node, R
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Tools: </span>
                    Github, Git, Supabase
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Hosting: </span>
                    Vercel, Netlify
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Design: </span>
                    Vercel, Figma
                  </li>
                </ul>
              </div>
              {/* Box Shadow Block */}
              <div className="absolute full top-4 -left-2 right-2 border-2 rounded-lg border-brand-black bg-brand-turqoise p-4 -z-10"
              
              >
                <h1 className="font-bold text-lg">Skills:</h1>
                <ul className="space-y-2">
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Frontend: </span>
                    React, Vite, HTML, TailwindCSS, JavaScript, Angular, NextJS
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Backend: </span>
                    Python, C++, C, MySQL, Python, Node, R
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Tools: </span>
                    Github, Git, Supabase
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Hosting: </span>
                    Vercel, Netlify
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">Design: </span>
                    Vercel, Figma
                  </li>
                </ul>
              </div>
              <img
                src="/images/Sparkle.svg"
                alt=""
                className="absolute bottom-0 -right-6"
              />
            </div>

            {/* Education Block */}
            <div className="w-[75%] lg:w-[40%] relative">
              {/* Main Block */}
              <div className="w-full border-2 border-brand-black p-4 rounded-lg bg-white flex flex-col gap-2">
                <h1 className="font-bold text-lg">Education:</h1>
                <ul className="space-y-2 mb-3 mt-2">
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">
                      B. Tech in Computer Engg
                    </span>
                    <br />
                    <span className="font-semibold text-[#444444]">
                      NMIMS - MPSTME, Mumbai
                    </span>
                    <br />
                    <span>Expected Graduation: 2027</span>
                    <br />
                    <span>CGPA: 3.95</span>
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">
                      ICSE Secondary Education
                    </span>
                    <br />
                    <span className="font-semibold text-[#444444]">
                      Friends' Academy, Mumbai
                    </span>
                    <br />
                    <span>Graduation: 2021</span>
                    <br />
                    <span>Percentage: 95.67%</span>
                  </li>
                </ul>
              </div>
              {/* Box Shadow Block */}
              <div className="absolute full top-4 -left-2 right-2 border-2 rounded-lg border-brand-black bg-brand-lavendar p-4 -z-10">
                <h1 className="font-bold text-lg">Skills:</h1>
                <ul className="space-y-2 mt-5">
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">
                      B. Tech in Computer Engg
                    </span>
                    <br />
                    <span className="font-semibold text-[#444444]">
                      NMIMS - MPSTME, Mumbai
                    </span>
                    <br />
                    <span>Expected Graduation: 2027</span>
                    <br />
                    <span>CGPA: 3.95</span>
                  </li>
                  <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('/images/Sparkle.svg')] before:bg-contain before:bg-no-repeat">
                    <span className="font-semibold">
                      ICSE Secondary Education
                    </span>
                    <br />
                    <span className="font-semibold text-[#444444]">
                      Friends' Academy, Mumbai
                    </span>
                    <br />
                    <span>Graduation: 2021</span>
                    <br />
                    <span>Percentage: 95.67%</span>
                  </li>
                </ul>
              </div>
              <img
                src="/images/Sparkle.svg"
                alt=""
                className="absolute top-2 -right-7"
              />
            </div>
          </div>
          {/* View Projects Button */}
          <div className="w-[75%] lg:w-[40%] relative">
            {/* Main Block */}
            <div className="w-full border-2 border-brand-black p-4 rounded-full bg-white flex flex-col gap-2 text-center">
              <div className="w-full flex gap-3 align-middle items-center justify-center">
                <h1 className="font-bold text-lg">View Projects</h1>
                <img src="/images/DownArrow.svg" width={26} />
              </div>
            </div>
            {/* View Projects Button */}
            <div className="absolute full top-2 -left-2 right-2 border-2 rounded-full border-brand-black bg-brand-pink p-4 -z-10">
              <div className="w-full flex gap-3 align-middle justify-center">
                <h1 className="font-bold text-lg">View Projects</h1>
                <img src="/images/DownArrow.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
}

export default Skills
