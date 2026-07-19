async function run() {
  const res = await fetch("http://localhost:3000/api/proxy-image?url=https://images.unsplash.com/photo-1500648767791-00dcc994a43e");
  console.log(res.status);
}
run();
