sed -i 's/const seedValue = isMale ? 99999 : 55555;/const seedValue = Math.floor(Math.random() * 1000000);/' src/server/routes/generate.ts
