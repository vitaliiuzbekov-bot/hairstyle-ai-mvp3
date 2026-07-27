const obj = { foo: 'bar' };
try {
  new Error(obj);
} catch(e) {
  console.log("Caught:", e.message);
}
