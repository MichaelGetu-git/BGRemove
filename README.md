# BGClean Background Removal website

An intelligent web-based image background removal tool built with **Next.js**, powered by the [Modnet Model](https://huggingface.co/Xenova/modnet) from @xenova/transformers. Upload an image, process it locally in the browser (no server needed), and apply custom backgrounds or colors before downloading.

## 🔥 Features

- 📤 Drag and drop image upload
- 🧠 AI-powered background removal (ONNX + WebAssembly)
- 🎨 Background customization (image or solid color)
- 🔍 Zoom in/out and preview
- 💾 Download high-quality processed images
- ⚡ 100% client-side – no backend, no data leaks

## 🚀 Demo

> https://bg-remove-three.vercel.app/

## 📸 Screenshots

<table>
  <thead>
    <tr>
      <th>Upload</th>
      <th>Processing</th>
      <th>Result + Editing</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="/public/images/upload.jpg" width="300" /></td>
      <td><img src="/public/images/processed.png" width="300" /></td>
      <td><img src="/public/images/result.png" width="300" /></td>
    </tr>
  </tbody>
</table>


## 🛠️ Tech Stack

- **Next.js 14**
- **React**
- **Tailwind CSS**
- **@xenova/transformers**
- **ONNX Runtime Web**
- **React Dropzone**
- **Framer Motion**

## Work Breakdown

<img src="/public/images/workbreakdown.png" width="400" />

_A preview of the background removal process._
