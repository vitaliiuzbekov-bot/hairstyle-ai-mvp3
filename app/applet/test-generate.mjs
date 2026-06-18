async function run() {
    console.log("Hitting localhost API");
    try {
        const body = {
            userId: "test",
            gender: "М",
            keyword: "Buzz cut",
            description: "",
            faceShape: "Овал",
            targetImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=512&auto=format&fit=crop",
            selfieImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABQAFADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAaEAACAgMBAAAAAAAAAAAAAAAABAUBAgMG/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQEBAQEBAQAAAAAAAAAAAAABAhITESH/2gAMAwEAAhEDEQA/AN4z/9k="
        };
        const r = await fetch("http://127.0.0.1:3000/api/generate-full", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const text = await r.text();
        console.log(r.status, text);
    } catch(e) { console.error(e); }
}
run();

