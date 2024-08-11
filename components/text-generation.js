const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const API_KEY = "";
const genai = new GoogleGenerativeAI(API_KEY);

const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

// async function run() {
//   const prompt = "top 10 places to visit";

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   console.log(response.text());
// }

// run();

// function fileToGenerativePart(path, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//       mimeType,
//     },
//   };
// }

// async function run() {
//   try {
//     const prompt = "Describe the image.";
//     const imagePart = fileToGenerativePart(`./dog.jpg`, "image/jpeg");

//     const result = await model.generateContent([prompt, imagePart]);
//     console.log(result.response.text());
//   } catch (error) {
//     console.error("Error generating content:", error);
//   }
// }

// async function run() {
//   const prompt = "Write a story about a magic backpack.";

//   const result = await model.generateContentStream(prompt);

//   for await (const chunk of result.stream) {
//     process.stdout.write(chunk.text());
//   }
// }

async function run() {
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });
  let result = await chat.sendMessage("I have 2 dogs in my house.");
  console.log(result.response.text());
  result = await chat.sendMessage("How many paws are in my house?");
  console.log(result.response.text());
}

run();
