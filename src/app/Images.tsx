import React, { useState } from "react";
import { ImageFile } from "./page";
import { ImageCanvas } from "./ImageCanvas";
import Image from "next/image";


interface ImagesProps {
  images: ImageFile[];
}

export const Images: React.FC<ImagesProps>=({images} : ImagesProps) =>{

  return (
    <div>
      <div>
        {images.map((image) => {
          return <ImageDisplay image = {image} key = {image.id}/>
        })}
      </div>
    </div>
  );
}

interface ImageDisplayProps {
  image: ImageFile;
}

function ImageDisplay({image}: ImageDisplayProps) {
  const [isImageCanvasOpen, setImageCanvasOpen] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState("");

  const url = URL.createObjectURL(image.file);
  const processedURL = image.processedFile ? URL.createObjectURL(image.processedFile) : "";
  const isProcessing = !image.processedFile;

  const handleEditSave = (editedImageUrl: string) => {
    setProcessedImageUrl(editedImageUrl);
  }

  const transparentBg = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==")`;

    if (!isImageCanvasOpen) { 
      return (
        <div className="flex flex-col items-center justify-center rounded-lg overflow-hidden  w-[100%]">
      <div className="relative">
        {isProcessing ? (
          <div className="relative aspect-square w-[700px] h-[500px]">
            <Image
             className="aspect-square object-cover opacity-50 transition-opacity duration-200"
             src={url} 
             alt="processing image"
             width={700} 
             height={500}
            />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-20 w-20 border-t-3 border-b-3 border-blue-500"></span>
              </div>
          </div>
        ) : (
          <div className="w-full"
            style={{
              background: transparentBg,
              backgroundRepeat: 'repeat'
            }}
          >
            <Image
              src = {processedImageUrl || processedURL}
              alt="example"
              width={700} 
              height={500} 
            />
          </div>
        )}
      </div>

      {!isProcessing && (
        <div className="flex items-center justify-center p-4">
          <button
            onClick={() => setImageCanvasOpen(true)}
            className="font-bold text-red-500 border border-gray-400 py-2 px-4 rounded mr-2 hover:bg-blue-500 hover:text-white transition-colors duration-200"
          >
            Edit
          </button>
          <a
            href={processedImageUrl || processedURL}
            download={`processed-${image.id}.png`}
            className="font-bold text-red-500 border border-gray-400 py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
          > 
            Download
          </a>
        </div>
      )}
      
    </div>
      )
    } else {
      return(
        <ImageCanvas
          image={image}
          isOpen = {isImageCanvasOpen}
          onClose={()=> setImageCanvasOpen(false)}
          onSave={handleEditSave}
        />
      )
    }
}