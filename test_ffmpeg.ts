import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const renderVideoWithFfmpeg = async (beforeBase64: string, afterBase64: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const tmpDir = os.tmpdir();
        const id = Date.now() + "_" + Math.random().toString(36).substring(7);
        const beforeFile = path.join(tmpDir, `before_${id}.jpg`);
        const afterFile = path.join(tmpDir, `after_${id}.jpg`);
        const outputFile = path.join(tmpDir, `output_${id}.mp4`);
        
        try {
            const bBuffer = Buffer.from(beforeBase64.split(",")[1] || beforeBase64, "base64");
            const aBuffer = Buffer.from(afterBase64.split(",")[1] || afterBase64, "base64");
            fs.writeFileSync(beforeFile, bBuffer);
            fs.writeFileSync(afterFile, aBuffer);
            
            // Generate cross-wipe video with 1s duration for each image and 1s transition, total 3s. Wait, 1.5s each, offset 0.5s -> 2s video
            // Let's do 2s each, 1s transition. Total length 3s.
            const cmd = `ffmpeg -y -loop 1 -t 2 -i ${beforeFile} -loop 1 -t 2 -i ${afterFile} -filter_complex "[0:v][1:v]xfade=transition=wipeleft:duration=1:offset=1,format=yuv420p" -c:v libx264 -preset veryfast -pix_fmt yuv420p ${outputFile}`;
            
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error("FFMPEG error:", stderr);
                    reject(error);
                } else {
                    const outBuffer = fs.readFileSync(outputFile);
                    resolve(outBuffer);
                }
                
                // Cleanup
                try {
                    fs.unlinkSync(beforeFile);
                    fs.unlinkSync(afterFile);
                    fs.unlinkSync(outputFile);
                } catch(e) {}
            });
        } catch (e) {
            reject(e);
        }
    });
};
