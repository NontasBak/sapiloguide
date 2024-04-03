import { tldrawToImage } from "@kitschpatrol/tldraw-cli";
import Jimp from "jimp";
import fs from "fs";
import { ImagesToPDF } from "images-pdf";

const imagePath = await tldrawToImage("./src/test.tldr", {
    format: "png",
    output: "./output_images/",
    dark: true,
});

console.log(`Wrote image to: "${imagePath}"`);

Jimp.read("./output_images/test.png").then((image) => {
    image
        .scaleToFit(1000, Jimp.AUTO, Jimp.RESIZE_BEZIER)
        .write("./resized_images/test_resized.png");
});

new ImagesToPDF().convertFolderToPDF("./resized_images", "./pdfs/output.pdf");
