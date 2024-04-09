import { tldrawToImage } from "@kitschpatrol/tldraw-cli";
import Jimp from "jimp";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { ImagesToPDF } from "images-pdf";

async function build() {
    const lessons = await fs.promises.readdir("./src/");

    for await (let lesson of lessons) {
        await fs.promises.mkdir(`./exported_images/${lesson}`);
        await fs.promises.mkdir(`./resized_images/${lesson}`);

        const exams = await fs.promises.readdir(`./src/${lesson}/`);

        for await (let exam of exams) {
            await convertTldrToImages(
                `./src/${lesson}/${exam}`,
                `./exported_images/${lesson}/`
            );
        }

        await resizeImages(
            `./exported_images/${lesson}`,
            `./resized_images/${lesson}`
        );

        //Glitch (?) with node, if setTimeout is removed it will not add the very last page
        setTimeout(() => {
            convertToPDF(`./resized_images/${lesson}`, `./pdfs/${lesson}.pdf`);
        }, 0);
    }
}

function convertToPDF(fromPath, toPath) {
    new ImagesToPDF().convertFolderToPDF(`${fromPath}`, `${toPath}`);
}

async function resizeImages(fromPath, toPath) {
    const exportedImages = await fs.promises.readdir(`${fromPath}`);

    for (let exportedImage of exportedImages) {
        await Jimp.read(`${fromPath}/${exportedImage}`).then((image) => {
            image
                .scaleToFit(1000, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                .write(`${toPath}/${exportedImage}`);
        });
    }
}

async function convertTldrToImages(fromPath, toPath) {
    const imagePath = await tldrawToImage(`${fromPath}`, {
        format: "png",
        output: `${toPath}`,
        dark: true,
        pages: true,
    });
}

//clear old images
fsExtra.emptyDirSync("./exported_images");
fsExtra.emptyDirSync("./resized_images");

build();
