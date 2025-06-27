import React, { useState } from "react";
import { ImageFile } from "../page";
import Image from "next/image";
import { ImageCanvas } from "./ImageCanvas";

interface ImagesProps {
  images: ImageFile[];
}

export const Images: React.FC<ImagesProps>=({images} : ImagesProps) =>{

  return (
    <div>
      <div>
        {images.map((image) => {
          return <ImageCanvas image = {image} key = {image.id}/>
        })}
      </div>
    </div>
  );
}
