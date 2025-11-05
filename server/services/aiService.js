const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function bufferToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

const runSafeguardCheck = async (imageBuffer, imageMimeType, userDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const imagePart = bufferToGenerativePart(imageBuffer, imageMimeType);

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  try {
    const cleanedJsonString = text.replace("```json", "").replace("```", "").trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Failed to parse JSON from Gemini Safeguard:", text);
    return { isValid: false, reason: "AI response was not in the expected format." };
  }
};

const runClassification = async (imageBuffer, imageMimeType, userDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const imagePart = bufferToGenerativePart(imageBuffer, imageMimeType);
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  try {
    const cleanedJsonString = text.replace("```json", "").replace("```", "").trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Failed to parse JSON from Gemini Classification:", text);
    return { category: "Other", title: "General service request" };
  }
};

module.exports = {
  runSafeguardCheck,
  runClassification,
};