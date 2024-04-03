import { tldrawToImage } from "@kitschpatrol/tldraw-cli";
import Jimp from "jimp";
import fs from "fs";
import fsExtra from "fs-extra";
import { ImagesToPDF } from "images-pdf";

const lessons = fs.readdirSync("./src/");
console.log(lessons);

fsExtra.emptyDirSync("./exported_images");

lessons.forEach((lesson) => {
    fs.mkdirSync(`./exported_images/${lesson}`);

    const exams = fs.readdirSync(`./src/${lesson}/`);

    exams.forEach((exam) => {
        fs.mkdirSync(`./exported_images/${lesson}/${exam}`);

        const examSolutions = fs.readdirSync(`./src/${lesson}/${exam}/`);

        examSolutions.forEach((examSolution) => {
            const imagePath = tldrawToImage(
                `./src/${lesson}/${exam}/${examSolution}`,
                {
                    format: "png",
                    output: `./exported_images/${lesson}/${exam}/`,
                    dark: true,
                }
            );
        });
    });
});

// Jimp.read("./exported_images/test.png").then((image) => {
//     image
//         .scaleToFit(1000, Jimp.AUTO, Jimp.RESIZE_BEZIER)
//         .write("./resized_images/test_resized.png");
// });

// new ImagesToPDF().convertFolderToPDF("./resized_images", "./pdfs/output.pdf");
