fetch("http://localhost:3000/api/reference", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    keyword: "Французский боб",
    gender: "Женщина",
    ageRange: "30",
    facialHair: "" // This will trigger "Clean shaven face. "
  })
}).then(res => res.json()).then(console.log).catch(console.error);
