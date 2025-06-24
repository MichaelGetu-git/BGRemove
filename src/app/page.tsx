"use client"

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { initializeModel, processImage, processImages } from "../lib/modelSegmentation";
import { useDropzone } from "react-dropzone";
import Link from "next/link";

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
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
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
      <div className="flex items-center justify-center">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4">
              <p>Loading background removal model</p>
            </div>
        </div>
      </div>
    )
  }
  return (
    <div className="font-bold">
      <nav className="bg-white shadow-sm">
        <div className="flex justify-between py-5 px-10">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">Bg Remover</h1>       
          </div>
          <div className="flex justify-between ">
            <Link href = '/' className="px-3 hover:text-orange-700">Home</Link>
            <Link href ='/' className="px-3 hover:text-orange-700">About</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10">
        <div className={images.length===0 ? '' : 'w-full'}>
          <div
            {...getRootProps()}
            className={`p-8 mb-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ease-in-out bg-white
              ${isDragAccept ? "border-green-500 bg-green-50" : ""}
              ${isDragReject ? "border-red-500 bg-red-50" : ""}
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}
            `}
          >
          </div>
          {images.length ===0 && (
            <div>
              well well well
            </div>
          )}
          <div>
            <h1> Number of Images{images.length}</h1>
          </div>
              {images && images.map((image)=>(
                image?.processedFile ? (
                  <img key={image.id} src={URL.createObjectURL(image.processedFile)}/>
                ) : null
              ))}
        </div>
      </main>
    </div>
  );
}
