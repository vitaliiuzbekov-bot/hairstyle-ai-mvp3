const obj = Object.create(null);
try {
  console.log(`Msg: ${obj}`);
} catch(e) {
  console.log(e.message);
}
