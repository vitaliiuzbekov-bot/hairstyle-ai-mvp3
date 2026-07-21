const regex = /^data:.*base64,(.+)$/;
const testString = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD";
const matches = testString.match(regex);
console.log(matches ? matches[1] : "No match");
