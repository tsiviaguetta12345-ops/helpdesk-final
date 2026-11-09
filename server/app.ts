import express from "express";

let app = express();
//TypeScript_2025\Server\public\public
app.use(express.json());

app.get(
  "/", (req, res) => {
    res.send("Hello World");
  });

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

console.log("Hello");
