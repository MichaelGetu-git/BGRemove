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
        <div className="relative flex items-center justify-center ml-40">
            <div className=" bg-gray/40 mx-30 p-5 grid grid-cols-2">
            <div className="">
                <div className="flex justify-between items-center p-4">
                    <h1 className="font-bold text-xl">Change your Look</h1>
                </div>
                <AnimatePresence mode="wait">
                    {isProcessing ? (
                        <motion.div
                            key={"processing"}
                            initial={{opacity:0}}
                            animate = {{opacity:1}}
                            exit = {{opacity: 0}}
                            transition={{duration: 0.5}}
                            className="relative"
                        >
                             <img
                                className="rounded-lg object-cover border border-gray-300"
                                src={url} 
                                alt="processing image"
                                width={650} 
                                height={450}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    className="w-15 h-15 border-4 border-blue-500 border-t-transparent rounded-full"
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

                        >
                            <div
                              style={{
                                background: !bgColor ? transparentBg: 'none',
                                backgroundRepeat: 'repeat'
                                }}                          
                            >
                                <img
                                    src = {!bgColor ? processedURL : exportUrl}
                                    alt="example"
                                    width={650} 
                                    height={450} 
                                    className="rounded-lg object-cover border border-gray-300"
                                />
                            </div>
                            
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex items-center justify-center gap-4 p-8">
                <Link
                    href={'/'}
                    className="font-bold text-red-500 border border-gray-400 py-2 px-4 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                    
                >
                    Cancel
                </Link>
                <Link
                    href={!bgColor ? processedURL : exportUrl}
                    download={`processed-${image.id}.png`}
                    className="font-bold text-white border border-gray-400 py-2 px-4 rounded bg-blue-500 hover:text-white transition-colors duration-200"
                >
                    Download
                </Link>
            </div>
            </div>
            <div className="m-15 p-5 w-50 bg-white rounded-lg shadow-md">
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