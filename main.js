import { tldrawToImage } from "@kitschpatrol/tldraw-cli";
import Jimp from "jimp";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { ImagesToPDF } from "images-pdf";

async function build() {
    const lessons = fs.readdirSync("./src/");

    for (let lesson of lessons) {
        fs.mkdirSync(`./exported_images/${lesson}`);
        fs.mkdirSync(`./resized_images/${lesson}`);

        const exams = fs.readdirSync(`./src/${lesson}/`);

        for (let exam of exams) {
            fs.mkdirSync(`./exported_images/${lesson}/${exam}`);
            fs.mkdirSync(`./resized_images/${lesson}/${exam}`);

            const examSolutions = await fs.promises.readdir(
                `./src/${lesson}/${exam}/`
            );

            for (let examSolution of examSolutions) {
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

        convertToPDF(lesson, exams);
    }
}

async function convertToPDF(lesson, exams) {
    await fsExtra.ensureDir("./tempFolder");

    for (let exam of exams) {
        const examImages = fs.readdirSync(
            `./resized_images/${lesson}/${exam}/`
        );

        for (let examImage of examImages) {
            await fsExtra.move(
                `./resized_images/${lesson}/${exam}/${examImage}`,
                `./tempFolder/${exam + "_" + examImage}`,
                { overwrite: true }
            );
        }
    }

    new ImagesToPDF().convertFolderToPDF(
        "./tempFolder",
        `./pdfs/${lesson}.pdf`
    );

    await fsExtra.emptyDir("./tempFolder");
}

//clear old images
fsExtra.emptyDirSync("./exported_images");
fsExtra.emptyDirSync("./resized_images");

build();
