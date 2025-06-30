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
      <td><img src="https://drive.google.com/uc?export=view&id=1FlayHofF2EwdS70Zlc7OlJm_63uyW7dP" width="320" /></td>
      <td><img src="https://drive.google.com/uc?export=view&id=1GV_qjYJ_KGN8g-0PzTeiOKP2ZW6M8IZA" width="320" /></td>
      <td><img src="https://drive.google.com/uc?export=view&id=1dOlo7oGUnxwhorFoxTM11dIPT-lC71qL" width="320" /></td>
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

<img src="/public/images/workbreakdown.png" width="600" />

_A preview of the background removal process._
