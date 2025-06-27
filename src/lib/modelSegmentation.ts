import {
    env,
    AutoModel,
    AutoProcessor,
    RawImage,
    PreTrainedModel,
    Processor,
} from "@xenova/transformers";

const RMBG_MODEL = "Xenova/modnet";

interface ModelState {
    model: PreTrainedModel | null;
    processor: Processor | null;
}

const state: ModelState = {
    model: null,
    processor: null,
}

export async function initializeModel(): Promise<boolean> {
    try {
        if (!navigator.gpu) {
            throw new Error("WebGPU is not supported in this browser. Please use Chrome/Edge with WebGPU enabled.");
        }

        env.allowLocalModels = false;
        env.backends.onnx.wasm.proxy = false; 

        console.log("WebGPU available, initializing MODNet model...");

        state.model = await AutoModel.from_pretrained(RMBG_MODEL, {
            device: "webgpu",
            progress_callback: (progress: any) => {
                if (progress.loaded && progress.total) {
                    console.log(`Loading Model: ${Math.round(progress.loaded / progress.total * 100)}%`);
                }
            }
        });

        state.processor = await AutoProcessor.from_pretrained(RMBG_MODEL);

        if (!state.model || !state.processor) {
            throw new Error("Failed to initialize the model!");
        }

        console.log("MODNet model initialized successfully!");
        return true;
    } catch(error) {
        console.error("Error initializing Model:", error);
        throw new Error(error instanceof Error ? error.message: "Failed to initialize background removal model!");
    }
}

export async function processImage(image: File): Promise<File> {
    if (!state.model || !state.processor) {
        throw new Error("Model not initiated yet, please wait!");
    }

    const img = await RawImage.fromURL(URL.createObjectURL(image));

    try {
        const { pixel_values } = await state.processor(img);

        const { output } = await state.model({ input: pixel_values });

        const maskData = (
            await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
                img.width,
                img.height,
            )
        ).data;

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if(!ctx) throw new Error("Could not get 2d context");

        ctx.drawImage(img.toCanvas(), 0, 0);

        const pixelData = ctx.getImageData(0, 0, img.width, img.height);
        for (let i = 0; i < maskData.length; ++i) {
            pixelData.data[4 * i + 3] = maskData[i];
        }
        ctx.putImageData(pixelData, 0, 0);

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (blob) => blob ? resolve(blob) : reject(new Error("Failed to create blob")),
                "image/png"
            );
        });

        const [fileName] = image.name.split(".");
        const processedFile = new File([blob], `${fileName}-bg-removed.png`, {type: "image/png"});
        return processedFile;
        
    } catch(error) {
        console.error("Error processing the image:", error);
        throw new Error("Failed to process the image");
    }
}

export async function processImages(images: File[]): Promise<File[]> {
    const processedFiles: File[] = [];

    for (const image of images) {
        try {
            const processedFile = await processImage(image);
            processedFiles.push(processedFile);
        } catch(error) {
            console.error("Error processing image", image.name, error);
        }
    }
    console.log("Processing images done");
    return processedFiles;
}

export function isWebGPUSupported(): boolean {
    return !!navigator.gpu;
}

export async function initializeModelFallback(): Promise<boolean> {
    try {
        console.log("WebGPU not available, trying fallback model...");
        
        throw new Error("This application requires WebGPU support. Please enable WebGPU in your browser or use Chrome/Edge with WebGPU flags enabled.");
        
    } catch(error) {
        console.error("Error initializing fallback model:", error);
        throw error;
    }
}