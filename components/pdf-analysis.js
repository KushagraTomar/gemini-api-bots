const API_KEY = "";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(API_KEY);

// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  // Upload the file and specify a display name.
  const uploadResponse = await fileManager.uploadFile(`./kush.pdf`, {
    mimeType: "application/pdf",
    displayName: "Kushagra Tomar PDF",
  });

  // View the response.
  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: "what is this document about?" },
  ]);

  // Output the generated text to the console
  console.log(result.response.text());
}

run();
