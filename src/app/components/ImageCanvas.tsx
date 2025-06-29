import { useEffect, useState } from "react";
import { ImageFile } from "../page";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";



interface ImageCanvasProps {
    image: ImageFile;
    
}

const backgroundColors = [
    '',
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#00ffff', '#ff00ff', '#808080', '#c0c0c0'
];
const transparentBg = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==")`;


export function ImageCanvas({image}: ImageCanvasProps){
    const [bgColor, setBgColor] = useState("");
    const [exportUrl, setExportUrl] = useState('');
    const [processedImageUrl, setProcessedImageUrl] = useState("");
    const [zoom, setZoom] = useState(1);

    const url = URL.createObjectURL(image.file);
    const processedURL = image.processedFile ? URL.createObjectURL(image.processedFile) : "";
    const isProcessing = !image.processedFile


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

        if (!bgColor) {

        } else {
            ctx.fillStyle = bgColor;
        }
        
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
        setProcessedImageUrl(exportUrl);
    }

    return(
        <div className="relative flex items-center justify-center">
            <div className="pl-40 bg-gray/40 grid grid-cols-2 gap-10">
            <div className="">
                <div className=" flex justify-between items-center">
                    <h1 className="font-bold text-xl">Preview</h1>
                    {isProcessing && (
                    <div>
                        <span className='font-bold text-purple-400'>processing...</span>
                    </div>
                    )}
                </div>
                <div className="flex items-center justify-center">
                <div className="relative max-w-[450px] max-h-[550px] w-fit h-full bg-gray-100 rounded-3xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.div
                                key={"processing"}
                                initial={{opacity:0}}
                                animate = {{opacity:1}}
                                exit = {{opacity: 0}}
                                transition={{duration: 0.5}}
                                className="relative w-full h-full"
                            >
                                <img
                                    className="w-auto h-auto max-w-full max-h-full object-contain"
                                    src={url} 
                                    alt="processing image"
                                    style={{transform: `scale(${zoom})`,transformOrigin: "center"}}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <motion.div
                                        className="w-25 h-25 border-4 border-blue-500 border-t-transparent rounded-full"
                                        animate = {{rotate: 360}}
                                        transition={{repeat: Infinity, duration: 1, ease: "linear"}}
                                    />

                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={"processed"}
                                initial={{opacity: 0, scale: 0.95}}
                                animate = {{opacity: 1, scale: 1}}
                                exit = {{opacity: 0, scale: 0.95}}
                                transition={{duration: 0.5}}
                                className="relative w-full h-full"

                            >
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{
                                        background: !bgColor ? transparentBg: 'none',
                                        backgroundRepeat: 'repeat'
                                        }}                          
                                >
                                    <img
                                        src = {!bgColor ? processedURL : exportUrl}
                                        alt="example"
                                        className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                        style = {{transform:  `scale(${zoom})`, transformOrigin: "center"}}
                                    />
                                </div>
                                
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="flex items-start justify-between p-5">
                <div className="flex items-center gap-4">
                    <button 
                        className='font-bold text-2xl hover:text-red-500 cursor-pointer'
                        onClick={()=> setZoom(z=> Math.max(z-0.1,1))}
                    >
                            -
                    </button>
                    <button 
                        className='font-bold text-2xl hover:text-red-500 cursor-pointer'
                        onClick={()=>setZoom(z=>Math.min(z+0.1,3))}
                    >
                        +
                    </button>
                </div>
                <Link
                    href={!bgColor ? processedURL : exportUrl}
                    download={`processed-${image.id}.png`}
                    className="font-bold text-white border border-gray-400 rounded-3xl py-2 px-5 bg-blue-500 hover:text-white transition-colors duration-200"
                >
                    Download
                </Link>
            </div>
            </div>
            <div className="flex flex-col items-center justify-center p-5 w-50 bg-white rounded-lg shadow-md border">
                <h1 className="font-bold p-2">Background colors</h1>
                <div className=" grid grid-cols-2 gap-4">
                    {backgroundColors.map((color, index) => (
                        <button
                            key={index}
                            onClick={()=> setBgColor(color)}
                            className="w-15 h-15 rounded-lg border border-gray-200 cursor-pointer"
                            style={{
                                background: color ==='' ? transparentBg : color,
                                backgroundRepeat: color==='' ? 'repeat': 'no-repeat',
                            }}
                            title={color ==='' ? 'Transparent' : color}
                        />

                        
                    ))}
                </div>
                
            </div>
            
            
        </div>
        </div>
    )

}