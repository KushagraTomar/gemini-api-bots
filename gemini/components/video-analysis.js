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
  const uploadResponse = await fileManager.uploadFile("../utils/rolex.mp4", {
    mimeType: "video/mp4",
    displayName: "ROLEX.mp4",
  });

  // View the response.
  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );

  // Upload the video file using the File API
  // uploadResponse = ...
  const name = uploadResponse.file.name;

  // Poll getFile() on a set interval (10 seconds here) to check file state.
  let file = await fileManager.getFile(name);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    // Sleep for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    // Fetch the file from the API again
    file = await fileManager.getFile(name);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("Video processing failed.");
  }

  // When file.state is ACTIVE, the file is ready to be used for inference.
  console.log(`File ${file.displayName} is ready for inference as ${file.uri}`);

  // Generate content using text and the URI reference for the uploaded file.
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    {
      text: "Summarize this video. Then create a quiz with answer key based on the information in the video.",
    },
  ]);

  // Handle the response of generated text
  console.log(result.response.text());
}

run();
