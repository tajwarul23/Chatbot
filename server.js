import express from "express";
import { generate } from "./chatbot.js";
const port = 5000;

const app = express();
app.get("/", (req, res) => {
  res.send("Welcome to ChatBot");
});
app.use(express.json());


app.post("/api/chat", async (req, res) => {
try {
      const { message, threadId } = req.body;
       if (!message?.trim()) {
      return res.status(400).json({ error: "message is required" });
    }
  const reply = await generate(message, threadId);
  
  res.status(200).json({ role: reply.role, message:reply.content, success: true });
} catch (error) {
    console.log("Error in /api/chat", error.message);
    res.status(500).json({ role: "system", message:"Try again Later", success: false });
}
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
