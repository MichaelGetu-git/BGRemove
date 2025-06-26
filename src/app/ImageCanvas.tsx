import { useEffect, useState } from "react";
import { ImageFile } from "./page";


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
    useEffect(()=> {
        if (image.processedFile) {
            applyChanges();
        }
    },[bgColor,applyChanges,image.processedFile]);

    

    const handleSave = () => {
        onSave(exportUrl);
        onClose();
    };

    if(!isOpen) return null;

    return(
        <div className="relative flex items-center justify-center ml-40">
            <div className=" bg-gray-100 mx-30 p-5 grid grid-cols-2">
            <div className="">
                <div className="flex justify-between items-center p-4">
                    <h1 className="font-bold text-xl">Change your Look</h1>
                </div>
                <div>
                <div>
                    <div>
                        <img
                            src = {exportUrl || processedURL}
                            alt="example"
                            width={700} 
                            height={500} 
                            className="w-full h-auto rounded-lg object-cover border border-gray-300"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 p-8">
                <button
                    onClick={onClose}
                    className="font-bold text-red-500 border border-gray-400 py-2 px-4 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="font-bold text-white border border-gray-400 py-2 px-4 rounded bg-blue-500 hover:text-white transition-colors duration-200"
                >
                    save Changes
                </button>
            </div>
            </div>
            <div className="m-15 p-5 w-50 bg-white rounded-lg shadow-md">
                <h1 className="font-bold p-2">Background colors</h1>
                <div className=" grid grid-cols-2 gap-4">
                    {backgroundColors.map(color => (
                        <button
                            key={color}
                            onClick={()=> setBgColor(color)}
                            className="w-15 h-15 rounded-lg border border-gray-200"
                            style={{backgroundColor: color}}
                        />

                        
                    ))}
                </div>
                
            </div>
            
            
        </div>
        </div>
    )

}