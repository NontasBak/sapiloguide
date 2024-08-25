import { tldrawToImage } from "@kitschpatrol/tldraw-cli";
import Jimp from "jimp";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { ImagesToPDF } from "images-pdf";
import { execSync } from "child_process";

async function build() {
    let lessons;

    //check if 'npm run build' was run
    if (process.env.npm_lifecycle_event === "build") {
        lessons = await fs.promises.readdir("./src/");
    } else {
        // "npm start" or "node main.js <changed_files>" through GH actions
        lessons = await getChangedLessons();

        if (lessons.length === 0) {
            throw new Error(
                `No changed .tldr files detected, did you mean to run 'npm run build'?`
            );
        }
    }

    console.log("Building the lessons: ", lessons);

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

        convertToPDF(
            `./resized_images/${lesson}`,
            `./pdfs/${lesson}` + "_sapiloguide" + ".pdf"
        );
    }

    console.log("Finished building PDFs.");
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
                        // .greyscale()
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
    console.log("Exporting: ", fromPath);
    const imagePath = await tldrawToImage(`${fromPath}`, {
        format: "png",
        output: `${toPath}`,
        dark: true, //Comment this line for white BG
        pages: true,
        name: `[${pageOrder}]-${path.parse(exam).name}`,
    });
}

function getChangedLessons() {
    return new Promise((resolve, reject) => {
        // No changed files detected through GH actions (or "npm start")
        if (process.argv.length === 2) {
            // Get a list of changed .tldr files
            const gitDiffOutput = execSync(
                "git diff --name-only HEAD"
            ).toString();
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

            const changedFiles = [...modifiedFiles, ...newFiles];

            // Extract the lesson names from the changed file paths and remove duplicates
            const changedLessons = [
                ...new Set(
                    changedFiles.map((file) => path.dirname(file).split("/")[1])
                ),
            ];

            resolve(changedLessons);
        } else {
            // For GH actions
            const changedFiles = process.argv.filter((arg, index) => index > 1);
            const changedTldrFiles = changedFiles.filter((file) =>
                file.endsWith(".tldr")
            );

            const changedPDFs = changedFiles.filter((file) =>
                file.endsWith(".pdf")
            );

            if (changedPDFs.length > 0) {
                throw new Error(
                    "PDFs were changed, no need to rebuild through GH actions."
                );
            }

            const changedLessons = [
                ...new Set(
                    changedTldrFiles.map(
                        (file) => path.dirname(file).split("/")[1]
                    )
                ),
            ];

            resolve(changedLessons);
        }
    });
}

// clear old images
fsExtra.emptyDirSync("./exported_images");
fsExtra.emptyDirSync("./resized_images");

build();
