"use client"

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Images } from "./Images";
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
      <div className="flex items-center justify-center">
          <div className="text-center">
              <h1 className="text-4xl">Error</h1>
          </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600 mb-4">
            </div>
            <p className="font-bold text-xl">Loading background removal processor</p>
            </div>
      </div>
    )
  }
  return (
    <div className="">
      <nav className="bg-white shadow-sm font-bold">
        <div className="flex justify-between py-5 px-10">
          <div>

            <h1 className="text-3xl font-bold text-gray-400 pl-10">Bg Remover</h1>       
          </div>
          <div className="flex justify-between pt-4">
            <Link href = '/' className="px-3 hover:text-orange-700">Home</Link>
            <Link href ='/about' className="px-3 hover:text-orange-700">About</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-full min-h-screen">
        <div className={""}>
          {images.length===0 && (
            <div className={`grid grid-cols-2 gap-2 px-20`}>
            <div className="p-10 flex flex-col items-center justify-center">
              <img src="images/hero.jpg" alt="logo image"  className="border border-gray-200 rounded-full w-70 h-70"/>
              <h1 className="font-extrabold text-5xl text-gray-500 pl-25">Remove Image <span className="text-blue-400">Backgrounds</span></h1>
              <span className="font-bold pl-20 pt-5">100% Free and private</span>
            </div>
            <div
              {...getRootProps()}
              className={` p-8 mb-8 border-2 border-dashed rounded-lg flex flex-col items-center text-center justify-center cursor-pointer transition-colors duration-300 ease-in-out bg-white h-80 mt-20 w-[95%]
                ${isDragAccept ? "border-green-500 bg-green-50" : ""}
                ${isDragReject ? "border-red-500 bg-red-50" : ""}
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}
              `}
            >
              <input {...getInputProps()} className="hidden"/>
              <img src="images/picsIcon.png" alt="" className="w-20 h-20"/>
              <h1 className="font-semibold text-gray-600 text-xl pt-3"><span className="text-blue-500">Drop</span> or <span className="text-blue-500">Select</span> your photo on here.</h1>
            </div>
          </div>
          )}
          <Images images= {images}/>
        </div>
        <div id="/about" className="ml-20 mt-10">
          <h1 className="text-3xl font-bold text-gray-500 text-left ">About</h1>
            This project is developed with the aid of an ai model specifically RMBG 1.4
        </div>
      </main>
    </div>
  );
}
