const API_KEY = "AIzaSyB-VHUGCkxDMElEPugEDQgRjBYHTPntMNk";

const {
  GoogleAIFileManager,
  FileState,
} = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI(API_KEY);

// Choose a Gemini model.
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(API_KEY);

async function run() {
  // Upload the file and specify a display name.
  const audioFile = await fileManager.uploadFile("../utils/sample.mp3", {
    mimeType: "audio/mp3",
    displayName: "Noddy Theme Song"
  });

  // View the response.
  console.log(
    `Uploaded file ${audioFile.file.displayName} as: ${audioFile.file.uri}`
  );

  // Generate content using text and the URI reference for the uploaded file.
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: audioFile.file.mimeType,
        fileUri: audioFile.file.uri,
      },
    },
    {
      text: "Generate lyrics of this music.",
    },
  ]);

  // Handle the response of generated text
  console.log(result.response.text());
}

run();
