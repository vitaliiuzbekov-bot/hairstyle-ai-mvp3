import FormData from 'form-data';

async function run() {
  const blob = new Blob(["test"], { type: "image/jpeg" });
  const form = new FormData();
  form.append('originalFaceBase64', "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="); // 1x1 black pixel
  form.append('hairstyleKeyword', 'Pixie Cut');
  form.append('gender', 'female');
  form.append('age', '30');
  form.append('vtonStrength', '70');

  try {
    const res = await fetch('http://localhost:3000/api/hairstyle/generate', {
      method: 'POST',
      body: form as any,
    });
    
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
  } catch(e) {
    console.error(e);
  }
}
run();
