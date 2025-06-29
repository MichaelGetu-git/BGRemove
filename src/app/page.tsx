"use client"

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Images } from "./components/Images";
import Image from "next/image";
import { button, div } from "framer-motion/client";
import Footer from "./components/Footer";
const modelSegmentation = await import("../lib/modelSegmentation");

interface LoadingError {
  message: string;
}

export interface ImageFile {
  id: number;
  file: File;
  processedFile?: File;
}


export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<LoadingError | null>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  
  
  useEffect(() => {
    (async () => {

      const { initializeModel } = await import("../lib/modelSegmentation");
      const initialized = await initializeModel();
   
      if (!initialized) {
        throw new Error("Failed to initialize Model");
      }

      setIsLoading(false);
    }) ();
  }, []);

  const onDrop = useCallback( async( acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      processedFile: undefined
    }));
    setImages(prev=>[...prev,...newImages]);
    
    for (const image of newImages) {
      try {
        const { processImages } = await import("../lib/modelSegmentation");
   
        const result = await processImages([image.file])
  
        if (result && result.length > 0){
          setImages(prev=> prev.map(
            img=>img.id===image.id ? { ...img, processedFile: result[0]} : img
          ));
        }
      } catch(error) {
        console.error("Error processing the image: ", error);
      }  
    }

    
  },[]);

  const {
    getRootProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    getInputProps
  } = useDropzone({
    onDrop, accept: {
      "image/*" : [".jpeg",".png",".mp4"],
    },
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10 bg-white shadow-sm rounded-xl">
          <p className="text-black font-bold">{error.message}</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Go back
          </button>
        </div>

      </div>
    );
  }

  const handleReset =() => {
    setImages([]);
  }
  
  return (
    <div className="reative">
      {isLoading && (
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 p-2"></div>
        <p className="text-teal-500 text-lg ml-4 font-bold text-xl pt-5">Background removal process loading...</p>
      </div>
      )}
      <div className={`transition-all duration-300 ${isLoading ? "blur-sm pointer-events-none opacity-100" : ""}`}>
      <header className="flex justify-between shadow-sm p-3 bg-white flex items-center justify-between px-15">
          <div className="text-purple-500 transition-colors">
            <button className="flex items-center gap-2 cursor-pointer"
              onClick={handleReset}
            >
              <div>
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-2 rounded-xl border border-gray-200 group-hover:border-blue-300 transition-all duration-200">
                  <Image src="/images/myLogo.png" 
                  width={35} 
                  height={35} 
                  alt="BgClean Logo"
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                </div>
              </div>
              <div className="flex flex-col items-start ml-2">
                <span className="text-2xl font-bold ">BGClean</span>
                <span className="text-xs text-gray-500 font-medium">Background Remover</span>
              </div>
              
            </button>
          </div>
          <div>
            {images.length > 0 && (
              <button
                onClick={handleReset}
                className="flex px-6 py-2 text-sm font medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-400"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Start Over</span>
                </span>
              </button>
            )}
          </div>
      </header>


      <main className="max-w-7xl mx-auto px-6 py-12">
      {images.length===0 && (
            <div>
              {/* Add Placement */}
              {/*
              <div className="mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Sponsered</p>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 min-h-[90px] items-center justify-center">
                      <span className="text-sm text-gray-400">Banner Ad Space</span>
                    </div>
                  </div>
                </div>
              </div>
              */}
            <div className={`grid grid-cols-2 gap-4 items-start mb-20`}>
            <div className="flex flex-col items-center pl-25 pt-0">
              <div className="rounded-2xl overflow-hidden  bg-gradient-to-r from-blue-100 to-purple-100 p-1/2 mb-4">
                <video 
                  src="/images/hero.mp4"
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-auto rounded-2xl"
                />              
              </div>
              <div className="">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">Remove Image
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> Backgrounds</span></h1>
                <span className="text-xl text-gray-600 font-medium">100% Free and private</span>
              </div>
            </div>
            <div className="space-y-4 pt-15">
              <div className='h-5'></div>
              <div className="flex flex-col items-center justify-center pb-10">
                <div
                  {...getRootProps()}
                  className={`
                    relative w-full max-w-md p-12 border-2 border-dashed rounded-3xl 
                    flex flex-col items-center text-center cursor-pointer 
                    transition-all duration-300 ease-out transform hover:scale-105
                    bg-white/70 backdrop-blur-sm shadow-xl
                    ${isDragAccept ? "border-green-400 bg-green-50/80 shadow-green-200" : ""}
                    ${isDragReject ? "border-red-400 bg-red-50/80 shadow-red-200" : ""}
                    ${isDragActive ? "border-blue-400 bg-blue-50/80 shadow-blue-200 scale-105" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"}
                  `}
                >
                  <input {...getInputProps()} className="hidden"/>
                  <div className="mb-6">
                    <div className="relative">
                      <img src="images/picsIcon.png" alt="" className="w-20 h-20"/>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          <span className="text-blue-500">Drop</span> or{" "}
                          <span className="text-blue-500">Select</span> Photos
                        </h3>
                        <p className="text-sm text-gray-500">
                          Supports JPG, PNG, WebP
                        </p>
                  </div>
                </div>
              </div>
              {/* Side Add Placement */}
              <div className="pt-10 bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-sm border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Sponsered</p>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 min-h-[200px] items-center justify-center">
                    <span className="text-sm text-gray-400">Banner Ad Space</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
          )}
           <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-3 z-30">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Ad</p>
              <div className="bg-gray-100 rounded-lg p-2 min-h-[50px] flex items-center justify-center">
                <span className="text-xs text-gray-400">Mobile Banner (320x50)</span>
              </div>
            </div>
          </div>
          <Images images= {images}/>
        {images.length===0 && (
          <div className="mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-200">
                  <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Sponsered</p>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 min-h-[90px] items-center justify-center">
                    <span className="text-sm text-gray-400">Banner Ad Space</span>
                  </div>
                </div>
              </div>
          </div>
        )}
        {images.length > 0 && (
          <div className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Advertisement</p>
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 min-h-[250px] flex items-center justify-center">
                <div className="text-gray-400">
                  <div className="w-full max-w-md h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">Ad Space (728x90 or 300x250)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>
      <Footer/>
    </div>
    </div>
  );
}
