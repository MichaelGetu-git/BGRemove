import { useEffect, useState, useCallback } from "react";
import { ImageFile } from "../page";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { div, h1 } from "framer-motion/client";



interface ImageCanvasProps {
    image: ImageFile;
    
}

const backgroundPics = [
    '/images/backgrounds/bg1.jpg',
    '/images/backgrounds/bg2.jpg',
    '/images/backgrounds/bg3.jpg',
    '/images/backgrounds/bg4.jpg',
    '/images/backgrounds/bg5.jpg',
    '/images/backgrounds/bg6.jpg',
]

const backgroundColors = [
    '',
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#00ffff', '#ff00ff', '#808080', '#c0c0c0'
];
const transparentBg = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==")`;


export function ImageCanvas({image}: ImageCanvasProps){
    const [bgColor, setBgColor] = useState("");
    const [backImage, setBackImage] = useState("");
    const [exportUrl, setExportUrl] = useState('');
    const [processedImageUrl, setProcessedImageUrl] = useState("");
    const [imgCanvasOpen, setImgCanvasOpen] = useState(false);
    const [imgEdit, setImgEdit] = useState(true);
    const [zoom, setZoom] = useState(1);

    const url = URL.createObjectURL(image.file);
    const processedURL = image.processedFile ? URL.createObjectURL(image.processedFile) : "";
    const isProcessing = !image.processedFile


    const applyChanges = useCallback(async () => {
        if (!image.processedFile) return;

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = processedURL;
            await new Promise((resolve, reject)=> {
                img.onload = resolve;
                img.onerror = reject;
            });

            canvas.width = img.width;
            canvas.height = img.height;

            
            if (backImage) {
                const bgImg = new Image();
                bgImg.src = backImage
                await new Promise((resolve,reject)=> {
                    bgImg.onload = resolve;
                    bgImg.onerror = reject;
                });

                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            } else if (bgColor){
                ctx.fillStyle = bgColor;
                ctx.fillRect(0,0,canvas.width, canvas.height);
                ctx.drawImage(img,0,0);

            } 
            const dataURL = canvas.toDataURL('image/png');
            setExportUrl(dataURL);
        } catch( error) {
            console.error("Error applying changes to the image:", error);
        }
    },[backImage,bgColor,processedURL,image.processedFile]);
    
    useEffect(()=> {
        if (image.processedFile) {
            applyChanges();
        }
    },[bgColor,backImage,applyChanges,image.processedFile]);

    const handleSave = () => {
        setProcessedImageUrl(exportUrl);
    }

    const handleClose = ()=> {
        setImgCanvasOpen(false)
    }
    const handleOpen = () => {
        setImgCanvasOpen(true);
    }
    
    const handleEditOpen = () => {
        setImgEdit(true);
    }

    const setBackImgHandler = (img: string) => {
        setBackImage(img);
        setBgColor("");
    };

    const setBackColorHandler = (color: string) => {
        setBgColor(color);
        setBackImage("");
    }

    return(
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`
                flex flex-col rounded-xl overflow-hidden
                ${imgCanvasOpen ? 'lg:flex-row' : ''}
            `}>
            
            <div className="flex-1 flex flex-col lg:flex-row">
            <div className="flex-1 p-4 sm:p-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="text-lg font-bold flex justify-between pb-2">
                    <h1>Preview</h1>
                    {isProcessing && (
                        <h1 className="font-bold text-purple-500">processing...</h1>
                    )} 
                </div>
                <div className="relative w-full mb-4">
                    <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden"
                        style={{minHeight:"100px",maxHeight:"60vh"}}
                    >
                        <AnimatePresence mode="wait">
                            {isProcessing ? (
                                <motion.div
                                    key={"processing"}
                                    initial={{opacity:0}}
                                    animate = {{opacity:1}}
                                    exit = {{opacity: 0}}
                                    transition={{duration: 0.5}}
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    <img
                                        className="max-w-full max-h-full object-contain"
                                        src={url} 
                                        alt="processing image"
                                        style={{transform: `scale(${zoom})`,transformOrigin: "center"}}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <motion.div
                                            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-500 border-t-transparent rounded-full"
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
                                    className="relative w-full h-full flex items-center justify-center"

                                >
                                    <div
                                        className="w-full h-full flex items-center justify-center p-2"
                                        style={{
                                            background: !bgColor && !backImage ? transparentBg: 'none',
                                            backgroundRepeat: 'repeat'
                                            }}                          
                                    >
                                        <img
                                            src = {!bgColor && !backImage ? processedURL : exportUrl}
                                            alt="processed image"
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                            style = {{transform:  `scale(${zoom})`, transformOrigin: "center"}}
                                        />
                                    </div>
                                    
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 rounded-full font-bold text-xl hover:bg-red-100 hover:text-red-500 transition-colors'
                            onClick={()=> setZoom(z=> Math.max(z-0.1,1))}
                        >
                                -
                        </button>
                        <button 
                            className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-100 rounded-full font-bold text-xl hover:bg-red-100 hover:text-red-500 transition-colors'
                            onClick={()=>setZoom(z=>Math.min(z+0.1,3))}
                        >
                            +
                        </button>
                    </div>
                    <Link
                        href={!bgColor && !backImage ? processedURL : exportUrl}
                        download={`processed-${image.id}.png`}
                        className="w-full sm:w-auto text-center font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-full py-3 px-6 transition-colors duration-200"
                    >
                        Download
                    </Link>
                </div>
            </div>
                
            </div>
            { !imgCanvasOpen ? (
            <div className="lg:pt-40 px-4 sm:p-6 lg:w-64 border-t lg:border-t-0 lg:border-l lg:border-r border-gray-200">
            <div className="flex flex-row justify-center gap-4 lg:flex-col gap-4 lg:justify-center lg:space-y-4 lg:gap-0 py-3">
                <button 
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 sm:p-3 rounded-xl hover:bg-purple-50 active:bg-purple-100 active:scale-95 transition-all duration-150 group"
                    onClick={handleOpen}
                >
                    <div className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 group-hover:bg-purple-100 group-active:bg-purple-200 transition-colors">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600 group-hover:text-purple-600 group-active:text-purple-700">+</span>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 group-hover:text-purple-600 group-active:text-purple-700 transition-colors text-center sm:text-left">Background</p>
                </button>
                <button 
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 sm:p-3 rounded-xl hover:bg-purple-50 active:bg-purple-100 active:scale-95 transition-all duration-150 group"
                    onClick={handleOpen}
                >
                    <div className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 group-hover:bg-purple-100 group-active:bg-purple-200 transition-colors">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-600 group-hover:text-purple-600 group-active:text-purple-700 italic tracking-tight">
                        f<span className="text-xs sm:text-sm lg:text-base relative -top-0.5">x</span>
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 group-hover:text-purple-600 group-active:text-purple-700 transition-colors text-center sm:text-left">Effects</p>
                </button>
            </div>
            </div>
            ) : (
                <div className="lg:pt-20 p-4 sm:p-6 lg:w-80 border-t lg:border-t-0 lg:border-l lg:border-r border-gray-200 bg-white">
                    <div className="flex flex-col">
                        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                            <button 
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    imgEdit 
                                        ? 'bg-white text-purple-600 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={()=> setImgEdit(!imgEdit)}
                            >
                                photo
                            </button>
                            <button
                                onClick={()=> setImgEdit(!imgEdit)}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    !imgEdit 
                                        ? 'bg-white text-purple-600 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Colors
                            </button>
                        </div>
                        <div className="mb-4">
                            {imgEdit ? (
                                <div className=" grid grid-cols-3 gap-3">
                                {backgroundPics.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={()=> setBackImgHandler(img)}
                                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg border border-2 border-gray-200 cursor-pointer hover:border-purple-500"
                                        style={{
                                            backgroundImage: `url(${img})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                ))}
                                </div>
                            )  : (
                                <div className=" grid grid-cols-3 gap-3">
                                {backgroundColors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={()=> setBackColorHandler(color)}
                                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg border border-2 hover:border-purple-500 border-gray-200 cursor-pointer"
                                        style={{
                                            background: color ==='' ? transparentBg : color,
                                            backgroundRepeat: color==='' ? 'repeat': 'no-repeat',
                                        }}
                                        title={color ==='' ? 'Transparent' : color}
                                    />
                                ))}
                                </div>
                            ) }
                        </div>
                    </div>
                    <div className="">
                            <button 
                                className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-full bg-white border border-gray-200 w-12 h-12 cursor-pointer hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                    </div>
                </div>
            )}
            </div>
            </div>
        </div>
    )

}