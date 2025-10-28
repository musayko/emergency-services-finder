// /server/services/aiService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Initialize the Google Generative AI client with the API key from our .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert a file on our server to a format Gemini can understand
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

// We will add our functions here...

module.exports = {
  // ...and export them
};
// --- Safeguard Check Function ---
const runSafeguardCheck = async (imagePath, imageMimeType, userDescription) => {
  // 1. Select the Gemini Pro Vision model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // 2. The prompt: We ask the AI to act as a moderator and return a specific JSON.
  const prompt = `
    You are a content moderator for a home emergency reporting app.
    Your task is to determine if the user's submission is a valid and appropriate request for a home repair emergency.
    The request is valid if it describes a real-world household problem (e.g., plumbing, electrical, structural damage).
    The request is invalid if it is spam, abusive, nonsensical, or clearly not related to a home emergency.

    Analyze the following user description and image.
    
    User description: "${userDescription}"

    Respond with ONLY a JSON object in the following format:
    {
      "isValid": boolean,
      "reason": "A brief explanation of your decision."
    }
  `;

  // 3. Prepare the image for the API call
  const imagePart = fileToGenerativePart(imagePath, imageMimeType);

  // 4. Send the prompt and image to the AI
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  // 5. Clean and parse the JSON response from the AI
  try {
    // The AI might return the JSON wrapped in markdown, so we clean it up.
    const cleanedJsonString = text.replace("```json", "").replace("```", "").trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Failed to parse JSON from Gemini Safeguard:", text);
    // If the AI fails to return valid JSON, we default to a safe, invalid state.
    return { isValid: false, reason: "AI response was not in the expected format." };
  }
};

// --- Classification Function ---
const runClassification = async (imagePath, imageMimeType, userDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // This prompt is more specific. It asks the AI to act as an expert and provide structured data.
  const prompt = `
    You are an expert home repair diagnostician. Your task is to analyze a user's emergency report, which includes an image and a text description.
    
    Based on the user's input, perform the following actions:
    1.  Determine the primary category of the problem from this specific list: ["Plumbing", "Electrical", "Structural", "HVAC", "Appliance Repair", "Other"].
    2.  Create a short, descriptive title for the job (max 10 words).

    Analyze the following user description and image.

    User description: "${userDescription}"

    Respond with ONLY a JSON object in the following format:
    {
      "category": "The determined category from the list.",
      "title": "A short, descriptive job title."
    }
  `;

  const imagePart = fileToGenerativePart(imagePath, imageMimeType);
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  try {
    const cleanedJsonString = text.replace("```json", "").replace("```", "").trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Failed to parse JSON from Gemini Classification:", text);
    // If parsing fails, return a default "Other" category.
    return { category: "Other", title: "General service request" };
  }
};


module.exports = {
  runSafeguardCheck,
  runClassification, // <-- ADD THE NEW FUNCTION HERE
};