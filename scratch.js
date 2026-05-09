const apiKey = "AIzaSyBcl6WV98ofEvsAxgK5h3_tkHpDLbJgigs";

async function listModels() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

listModels();
