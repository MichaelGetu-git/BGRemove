import { useState } from "react";
import { ImageFile } from "./page";

interface ImagesProps {
  images: ImageFile[];
}

export function Image({images} : ImagesProps) {

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

interface ImageDisplay({image}: ImageDisplayProps) {
  const [isImageCanvasOpen, setImageCanvasOpen] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState("");

  const url = URL.createObjectURL(image.file);
}