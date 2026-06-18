import fs from 'fs';

async function runFullTest() {
  console.log("Starting full test...");
  
  const resImage = await fetch("https://thispersondoesnotexist.com");
  const blob = await resImage.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());

  const rootUrl = "http://localhost:3000";
  const userId = "test_user_integration_" + Date.now();

  try {
    // 1. Analyze
    console.log("1. /api/hairstyle/analyze");
    const form = new FormData();
    form.append('photo', blob, 'test_face.jpg');
    form.append('user_id', userId);

    const analyzeRes = await fetch(`${rootUrl}/api/hairstyle/analyze`, {
      method: "POST",
      body: form
    });

    console.log("Analyze Status:", analyzeRes.status);
    const analyzeText = await analyzeRes.text();
    let analyzeData;
    try {
      analyzeData = JSON.parse(analyzeText);
    } catch(e) {
      console.log("Failed to parse analyze response! HTML is:");
      console.log(analyzeText);
      return;
    }
    
    if (!analyzeData.success) {
      console.log("Analyze failed:", analyzeData);
      return;
    }

    const hairstyles = analyzeData.recommendations.map((r: any) => r.name);
    console.log("Hairstyles recommended:", hairstyles);

    // 2. References
    console.log("2. /api/hairstyle/references");
    const refRes = await fetch(`${rootUrl}/api/hairstyle/references`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, hairstyles })
    });
    console.log("References Status:", refRes.status);
    const refText = await refRes.text();
    const refData = JSON.parse(refText);
    console.log("References returned:", refData.references?.length || refData);

    // 3. Generate Image
    const targetStyle = analyzeData.recommendations[0];
    console.log(`3. /api/generate-full for ${targetStyle.name}`);
    const base64Image = "data:image/jpeg;base64," + buffer.toString("base64");
    
    const genParams = {
        userId: userId,
        selfieImage: base64Image,
        keyword: targetStyle.imageKeyword,
        description: targetStyle.description,
        vtonStrength: 50,
        gender: analyzeData.gender,
        faceShape: analyzeData.faceShape,
        hairLength: analyzeData.hairLength,
        hairDensity: analyzeData.hairDensity,
        hairType: analyzeData.hairType,
        skinTone: analyzeData.skinTone,
        skinDetails: analyzeData.skinDetails,
        hairColor: analyzeData.hairColor,
        eyeColor: analyzeData.eyeColor,
        ageRange: analyzeData.userInfo?.age ? `${analyzeData.userInfo.age-5}-${analyzeData.userInfo.age+5}` : undefined,
        facialFeatures: analyzeData.facialFeatures,
        facialHair: analyzeData.facialHair,
        clothingContext: analyzeData.clothingContext,
        hairlineStatus: analyzeData.hairlineStatus,
        hairQuality: analyzeData.hairQuality,
    };

    const genFullRes = await fetch(`${rootUrl}/api/generate-full`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genParams)
    });
    
    console.log("Generate Full Status:", genFullRes.status);
    const genFullData = await genFullRes.json();
    console.log("Generate Full resulted in image:", genFullData.imageUrl ? "YES" : "NO", genFullData);

  } catch(e) {
    console.error("Test Exception:", e);
  }
}

runFullTest();
