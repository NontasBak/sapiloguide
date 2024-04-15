import { tldrawToImage } from "@kitschpatrol/tldraw-cli";
import Jimp from "jimp";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { ImagesToPDF } from "images-pdf";
import { execSync } from "child_process";

async function build() {
    const lessons = await getChangedLessons();
    // const lessons = await fs.promises.readdir("./src/");

    for (let lesson of lessons) {
        await fs.promises.mkdir(`./exported_images/${lesson}`);
        await fs.promises.mkdir(`./resized_images/${lesson}`);

        const exams = await fs.promises.readdir(`./src/${lesson}/`);

        let pageOrder = exams.length;
        for (let exam of exams) {
            await convertTldrToImages(
                `./src/${lesson}/${exam}`,
                `./exported_images/${lesson}/`,
                pageOrder,
                exam
            );

            pageOrder--;
        }

        await resizeImages(
            `./exported_images/${lesson}`,
            `./resized_images/${lesson}`
        );

        convertToPDF(`./resized_images/${lesson}`, `./pdfs/${lesson}.pdf`);
    }
}

function convertToPDF(fromPath, toPath) {
    new ImagesToPDF().convertFolderToPDF(`${fromPath}`, `${toPath}`);
}

async function resizeImages(fromPath, toPath) {
    const exportedImages = await fs.promises.readdir(`${fromPath}`);
    const promises = [];

    for (let exportedImage of exportedImages) {
        const promise = Jimp.read(`${fromPath}/${exportedImage}`).then(
            (image) => {
                return new Promise((resolve, reject) => {
                    image
                        .scaleToFit(3000, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                        .write(`${toPath}/${exportedImage}`, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                });
            }
        );
        promises.push(promise);
    }

    await Promise.all(promises);
}

async function convertTldrToImages(fromPath, toPath, pageOrder, exam) {
    console.log(fromPath);
    const imagePath = await tldrawToImage(`${fromPath}`, {
        format: "png",
        output: `${toPath}`,
        dark: true,
        pages: true,
        name: `[${pageOrder}]-${path.parse(exam).name}`,
    });
}

function getChangedLessons() {
    return new Promise((resolve, reject) => {
        // Get a list of changed .tldr files
        const gitDiffOutput = execSync("git diff --name-only HEAD").toString();
        const modifiedFiles = gitDiffOutput
            .split("\n")
            .filter((file) => file.endsWith(".tldr"));

        // Get a list of new .tldr files
        const gitLsFilesOutput = execSync(
            "git ls-files --others --exclude-standard"
        ).toString();
        const newFiles = gitLsFilesOutput
            .split("\n")
            .filter((file) => file.endsWith(".tldr"));

        // Combine the lists of changed and new files
        const changedFiles = [...modifiedFiles, ...newFiles];

        // Extract the lesson names from the changed file paths and remove duplicates
        const changedLessons = [
            ...new Set(
                changedFiles.map((file) => path.dirname(file).split("/")[1])
            ),
        ];

        resolve(changedLessons);
    });
}

// clear old images
fsExtra.emptyDirSync("./exported_images");
fsExtra.emptyDirSync("./resized_images");

build();
