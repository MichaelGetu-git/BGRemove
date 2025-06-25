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
      <h1>{images.length}</h1>
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

  return(
    <div>
      <div>
        {isProcessing ? (
          <div>
            <img src={url} alt="processing image" />
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
              width={500} 
              height={300} 
            />
          </div>
        )}
      </div>

      {!isProcessing && (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setImageCanvasOpen(true)}
            className="font-bold text-blue-500 border border-gray-300"
          >
            Edit
          </button>
          <a
            href={processedImageUrl || processedURL}
            download={`processed-${image.id}.png`}
            className="font-bold text-blue-500 border border-gray-300"
          >
            Download
          </a>
        </div>
      )}
      <ImageCanvas
        image={image}
        isOpen = {isImageCanvasOpen}
        onClose={()=> setImageCanvasOpen(false)}
        onSave={handleEditSave}
      />
    </div>
  )
}