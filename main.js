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
            await fs.promises.mkdir(`./exported_images/${lesson}/${exam}`);
            await fs.promises.mkdir(`./resized_images/${lesson}/${exam}`);

            const examSolutions = await fs.promises.readdir(
                `./src/${lesson}/${exam}/`
            );

            for await (let examSolution of examSolutions) {
                const imagePath = await tldrawToImage(
                    `./src/${lesson}/${exam}/${examSolution}`,
                    {
                        format: "png",
                        output: `./exported_images/${lesson}/${exam}/`,
                        dark: true,
                    }
                );

                Jimp.read(
                    `./exported_images/${lesson}/${exam}/${
                        path.parse(examSolution).name
                    }.png`
                ).then((image) => {
                    image
                        .scaleToFit(1000, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                        .write(
                            `./resized_images/${lesson}/${exam}/${
                                path.parse(examSolution).name
                            }.png`
                        );
                });

                console.log(`Finished ${exam}/${examSolution}`);
            }
        }
    }
}

//clear old images
fsExtra.emptyDirSync("./exported_images");
fsExtra.emptyDirSync("./resized_images");

build();

// new ImagesToPDF().convertFolderToPDF("./resized_images", "./pdfs/output.pdf");
