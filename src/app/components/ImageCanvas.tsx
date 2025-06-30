import { useEffect, useState, useCallback } from "react";
import { ImageFile } from "../page";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";



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
        <div className={`flex items-center justify-center border-gray-100 ${imgCanvasOpen ? "flex items-center justify-center border-gray-100": "bg-gray-50 rounded-xl max-w-4xl max-h-3xl mx-auto shadow-lg "}`}>
            <div className="flex flex-col w-4xl">
            <div className=" flex justify-between items-center pt-4 px-10">
                    <h1 className="font-bold text-xl">Preview</h1>
                    {isProcessing && (
                    <div>
                        <span className='font-bold text-purple-400'>processing...</span>
                    </div>
                    )}
            </div>
            <div className="mx-auto bg-gray/40 flex">
            <div className="p-4">
                
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
                                        background: !bgColor && !backImage ? transparentBg: 'none',
                                        backgroundRepeat: 'repeat'
                                        }}                          
                                >
                                    <img
                                        src = {!bgColor && !backImage ? processedURL : exportUrl}
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
                    href={!bgColor && !backImage ? processedURL : exportUrl}
                    download={`processed-${image.id}.png`}
                    className="font-bold text-white border border-gray-400 rounded-3xl py-2 px-5 bg-blue-500 hover:text-white transition-colors duration-200"
                >
                    Download
                </Link>
            </div>
            </div>
            { !imgCanvasOpen ? (
                <div className="flex flex-col items-start justify-start pt-20 w-52 p-4 space-y-4">
                <button 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={handleOpen}
                    >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 group-hover:bg-purple-100 transition">
                        <span className="text-2xl font-bold text-gray-600 group-hover:text-purple-600">+</span>
                    </div>
                    <p className="text-base font-medium text-gray-800 group-hover:text-purple-600 transition">Background</p>
                </button>
                <button 
                    className="flex items-center cursor-pointer group gap-3"
                    onClick={handleOpen}
                    >
                    <div className=" w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 group-hover:bg-purple-100 transition">
                        <span className="text-xl font-semibold text-gray-600 group-hover:text-purple-600"><span className="text-sm">f</span>X</span>
                    </div>
                    <p className="text-base font-medium text-gray-800 group-hover:text-purple-600 transition">Effects</p>
                </button>
            </div>
            ) : (
                <div className="flex">
                    <div className="flex flex-col items-start justify-start w-80 p-4 bg-white border border-gray-100 shadow-lg rounded-3xl">
                        <div className="flex items-center justify-start w-full gap-4 px-2 pb-5">
                            <button 
                                className={`cursor-pointer ${imgEdit ? 'bg-purple-100 text-black py-2 px-5 rounded-full' : 'bg-gray-50 '}`}
                                onClick={handleEditOpen}
                            >
                                photo
                            </button>
                            <button
                                onClick={()=> setImgEdit(!imgEdit)}
                                className={`cursor-pointer ${!imgEdit ? 'bg-purple-100 text-black py-2 px-5 rounded-full' : 'bg-gray-50 '}`}
                            >
                                Colors</button>
                        </div>
                        {imgEdit ? (
                            <div className=" grid grid-cols-3 gap-4">
                            {backgroundPics.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={()=> setBackImgHandler(img)}
                                    className="w-20 h-20 rounded-lg border border-2 border-gray-200 cursor-pointer hover:border-purple-500"
                                    style={{
                                        backgroundImage: `url(${img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                            ))}
                            </div>
                        )  : (
                            <div className=" grid grid-cols-3 gap-4">
                            {backgroundColors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={()=> setBackColorHandler(color)}
                                    className="w-20 h-20 rounded-lg border border-2 hover:border-purple-500 border-gray-200 cursor-pointer"
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
                    <div className="px-4">
                            <button 
                                className="rounded-full bg-white border border-gray-200 w-12 h-12 cursor-pointer hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                onClick={handleClose}
                            >
                                X
                            </button>
                    </div>
                </div>
                
            )}
            </div>
            </div>
        </div>
    )

}