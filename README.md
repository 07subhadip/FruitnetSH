# FruitNet SH: Pomegranate Disease Classifier

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-Library-orange?style=flat&logo=tensorflow)](https://www.tensorflow.org/js)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://fruitnet-sh.vercel.app/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

An advanced, high-performance web application designed for the early detection and classification of pomegranate diseases using Deep Learning.

---

## 🔗 Live Demo
Experience the real-time AI classification here:  
**[https://fruitnet-sh.vercel.app/](https://fruitnet-sh.vercel.app/)**

---

## 🔬 Project Overview
FruitNet SH leverages a custom-trained **EfficientNetB0** architecture to classify pomegranate leaf and fruit images into five distinct categories. The project bridges the gap between complex ML research and an accessible, user-friendly interface, providing specialized diagnostics for pomegranate cultivation.

### Classification Categories:

- **Alternaria**
- **Anthracnose**
- **Bacterial Blight**
- **Cercospora**
- **Healthy**

---

## 🚀 Key Features

- **In-Browser Inference**: AI predictions happen directly on the user's device using TensorFlow.js, ensuring data privacy and zero server latency.
- **Cyberpunk UI/UX**: A high-impact, futuristic dashboard designed with professional aesthetics and smooth staggered animations.
- **Adaptive Dashboard**: Responsive layout optimized for multiple screen resolutions.
- **Video-Game Inspired Results**: Sequential analysis pop-ins and animated confidence bars for a premium user experience.

---

## 🛠 Tech Stack

### Artificial Intelligence

- **Keras/TensorFlow**: Model training and optimization.
- **EfficientNetB0**: Base architecture for feature extraction.
- **TensorFlow.js**: Client-side model execution.

### Web Architecture

- **Next.js 15+**: App router and optimized deployment.
- **Custom CSS**: Vanilla CSS for specialized Cyberpunk design system (Glassmorphism, Neon effects).
- **Vercel**: Edge deployment and hosting.

---

## 🏗 how it works

1. **Data Acquisition**: Users upload a target pomegranate image.
2. **Preprocessing**: The image is rendered to a hidden canvas, normalized to the `[-1, 1]` range, and resized to `224x224` pixels to match the EfficientNet input layer.
3. **Neural Computation**: The TensorFlow.js engine executes the graph model across five classification layers.
4. **Data Stream Output**: Results are streamed sequentially to the UI with confidence scores and threat-level assessments.

---

## 💻 Installation & Setup

To run this project locally, follow these steps:

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/07subhadip/FruitnetSH.git
   cd FruitnetSH
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📖 Usage Guide

1. **Upload**: Drag and drop or click to upload a JPG/PNG image of a pomegranate.
2. **Scan**: Click the **START_SCAN** button to initiate neural analysis.
3. **Analyze**: Review the primary diagnosis and secondary probability scores.
4. **Reset**: Use **RE-SCAN_NEW_TARGET** to clear the cache and analyze a new sample.

---

## 📸 Screenshots

![FruitNet SH Dashboard](/public/demo.png)
*Modern, Cyberpunk-inspired dashboard featuring neon accents and real-time inference indicators.*

---

## 🔮 Future Improvements
- **PWA Support**: Offline analysis capabilities for field use.
- **Batch Processing**: Ability to upload and analyze multiple images simultaneously.
- **Metadata Export**: Option to download analysis reports as PDF/JSON.
- **Real-time Camera Feed**: Scanning via mobile device camera integration.

---

## 👤 Author

**Subhadip Hensh (07subhadip)**  
*Project Lead & AI Developer*  
- [GitHub](https://github.com/07subhadip)
- [LinkedIn](https://www.linkedin.com/in/subhadiphensh/)

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
