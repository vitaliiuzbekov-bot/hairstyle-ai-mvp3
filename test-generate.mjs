import fetch from "node-fetch";

async function run() {
    const r = await fetch("http://127.0.0.1:3000/api/generate-full", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: "test",
            gender: "М",
            keyword: "Buzz cut",
            description: "",
            faceShape: "Овал",
            selfieImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABQAFADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAaEAACAgMBAAAAAAAAAAAAAAAABAUBAgMG/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQEBAQEBAQAAAAAAAAAAAAABAhITESH/2gAMAwEAAhEDEQA/AN4z/9k="
        })
    });
    const text = await r.text();
    console.log(r.status, text);
}
run();
