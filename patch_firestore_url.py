import sys

with open("src/server/routes/generate.ts", "r") as f:
    content = f.read()

target = 'await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob });'
replacement = 'await adminDb.collection("jobs").doc(jobId).update({ status: "done", imageUrl: swappedImageUrlForJob, referenceImage: finalImageUrlForJob, originalUrl: originalImageUrl });'

content = content.replace(target, replacement)

with open("src/server/routes/generate.ts", "w") as f:
    f.write(content)
