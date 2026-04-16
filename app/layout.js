import "./globals.css";

export const metadata = {
    title: "FruitNet SH — Pomegranate Disease Detector",
    description:
        "AI-powered pomegranate disease detection using deep learning. Upload an image to instantly identify Alternaria, Anthracnose, Bacterial Blight, Cercospora, or Healthy fruit.",
    keywords: [
        "pomegranate",
        "disease detection",
        "deep learning",
        "AI",
        "FruitNet",
        "plant pathology",
    ],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="bg-animated" />
                {children}
            </body>
        </html>
    );
}
