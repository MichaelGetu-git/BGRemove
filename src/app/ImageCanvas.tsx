import { useEffect, useState } from "react";
import { ImageFile } from "./page";
import Image from 'next/image';


interface ImageCanvasProps {
    image: ImageFile;
    isOpen: boolean;
    onClose: ()=> void;
    onSave: (url: string) => void;
}

const backgroundColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#00ffff', '#ff00ff', '#808080', '#c0c0c0'
];

export function ImageCanvas({image, isOpen, onClose, onSave}: ImageCanvasProps){
    const [bgColor, setBgColor] = useState("#ffffff");
    const [exportUrl, setExportUrl] = useState('');


    const processedURL = image.processedFile ? URL.createObjectURL(image.processedFile) : "";

    useEffect(()=> {
        if (image.processedFile) {
            applyChanges();
        }
    },[bgColor]);

    const applyChanges = async () => {
        if (!image.processedFile) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = processedURL;
        await new Promise(resolve => img.onload = resolve);

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(img,0,0);


        const dataURL = canvas.toDataURL('image/png');
        setExportUrl(dataURL);
    };

    const handleSave = () => {
        onSave(exportUrl);
        onClose();
    };

    if(!isOpen) return null;

    return(
        <div>
            <div className="flex justify-between">
                <h1>Edit Image</h1>
                <button
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
            <div>
                <h1>background</h1>
                <div>
                    {backgroundColors.map(color => (
                        <button
                            key={color}
                            onClick={()=> setBgColor(color)}
                            className="w-10 h-10 rounded-full border bourder-gray-200"
                            style={{backgroundColor: color}}
                        />

                        
                    ))}
                </div>
                <div>
                    <h1>first look</h1>
                    <div>
                        <Image
                            src = {exportUrl || processedURL}
                            alt="example"
                            width={500} 
                            height={300} 
                        />
                    </div>
                </div>
            </div>
            <div>
                <button
                    onClick={onClose}
                    className="border border-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="border border-gray-300"
                >
                    save Changes
                </button>
            </div>
            
        </div>
    )

}