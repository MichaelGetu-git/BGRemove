import {
    env,
    AutoModel,
    AutoProcessor,
    RawImage,
    PreTrainedModel,
    Processor,
} from "@huggingface/transformers";

const RMBG_MODEL = "briaai/RMBG-1.4";

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
        
        env.allowLocalModels = false;
        
        env.allowLocalModels = false;
        if (env.backends?.onnx?.wasm) {
            env.backends.onnx.wasm.proxy = true;
        }
        state.model = await AutoModel.from_pretrained(RMBG_MODEL, {
            progress_callback: (progress: number) => {
                console.log(`Loading Model: ${Math.round(Number(progress) * 100)}%`);
            }
        });

        state.processor = await AutoProcessor.from_pretrained(RMBG_MODEL, {
            revision: "main",
            config: {
                do_normalize: true,
                do_pad: true,
                do_rescale: true,
                do_resize: true,
                image_mean: [0.5, 0.5, 0.5],
                feature_extractor_type: "ImageFeatureExtractor",
                image_std: [0.5,0.5,0.5],
                resample: 2,
                rescale_factor: 0.00392156862745098,
                size: {width: 1024, height: 1024}
            }
        });

        if (!state.model || !state.processor) {
            throw new Error("Failed to initialize the model!!!");
        }

        return true;
    } catch(error) {
        console.error("Error initializing Model:", error);

        throw new Error(error instanceof Error ? error.message: "Failed to initialize background removal model!");
    }
}

export async function processImage(image: File): Promise<File> {

    if (!state.model || !state.processor) {
        throw new Error("Model not Initiated yet, please wait!!");
    }

    const img = await RawImage.fromURL(URL.createObjectURL(image));


    try {

        const { pixel_values } = await state.processor(img);

        const { output } = await state.model({ input: pixel_values});

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

        ctx.drawImage(img.toCanvas(), 0,0);

        const pix_Data = ctx.getImageData(0,0, img.width, img.height);
        for (let i=0; i< maskData.length; ++i) {
            pix_Data.data[4*i + 3] = maskData[i]
        }
        ctx.putImageData(pix_Data, 0, 0)

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (blob) => blob ? resolve(blob) : reject(new Error("Failed to create blob")),
                "image/png"
            )
        });

        const [fileName] = image.name.split(".");
        const processedFile = new File([blob], `${fileName}-bg-converted.png`, {type: "image/png"});
        return processedFile
    } catch( error ) {
        console.error(" Error processing the image:", error);
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