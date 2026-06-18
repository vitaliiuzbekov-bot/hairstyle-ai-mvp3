import fs from 'fs';

async function run() {
  const resImage = await fetch("https://thispersondoesnotexist.com");
  const blob = await resImage.blob();

  const form = new FormData();
  form.append('photo', blob, 'test_face.jpg');
  form.append('user_id', 'test_user_id');

  try {
    const analyzeRes = await fetch('http://localhost:3000/api/hairstyle/analyze', {
      method: 'POST',
      body: form,
    });
    
    console.log("Analyze Status:", analyzeRes.status);
    const analyzeData: any = await analyzeRes.json();

    if (analyzeData?.recommendations?.length > 0) {
      const hairstyle_names = analyzeData.recommendations.map((r: any) => r.name);
      console.log(`Getting references for ${hairstyle_names.join(', ')}...`);
      
      const refRes = await fetch('http://localhost:3000/api/hairstyle/references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'test_user_id',
          hairstyles: hairstyle_names
        }),
      });
      console.log("Ref Status:", refRes.status);
      const refData: any = await refRes.json();
      console.log("Ref Data refs returned:", refData?.references?.length);

      const hairstyle_name = hairstyle_names[0];
      console.log(`Generating for hairstyle: ${hairstyle_name}...`);
      const generateRes = await fetch('http://localhost:3000/api/hairstyle/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'test_user_id',
          hairstyle_name
        }),
      });
      console.log("Generate Status:", generateRes.status);
      const genData: any = await generateRes.json();
      console.log("Generate Result:", genData.resultUrl ? "ok" : JSON.stringify(genData));
    }

  } catch(e) {
    console.error(e);
  }
}
run();
