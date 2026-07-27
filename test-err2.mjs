const obj = Object.create(null);
try {
  new Error(obj);
} catch(e) {
  console.log("Caught:", e.message);
}
