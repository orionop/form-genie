document.getElementById("fillForm").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: autoFillForm
      });
  });
});

async function autoFillForm() {
  console.log("Form Genie AI Auto-Fill Started!");

  const formFields = document.querySelectorAll('input[type="text"], textarea');
  
  for (let input of formFields) {
      const questionText = input.closest('.Qr7Oae')?.innerText || "default question";
      let aiResponse = await getAIResponse(questionText);
      
      // If AI fails, use fallback text
      if (!aiResponse || aiResponse.length === 0) {
          aiResponse = "Generated Answer";
          console.warn(`GPT failed for: ${questionText}, using fallback.`);
      }
      
      input.value = aiResponse;
      input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // Fill MCQs (Radio Buttons)
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (Math.random() > 0.5) {
          radio.click();
      }
  });

  // Fill Checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      if (Math.random() > 0.5) {
          checkbox.click();
      }
  });

  console.log("Form Genie AI Auto-Fill Completed!");
}

// Function to call GPT API
async function getAIResponse(question) {
  const apiKey = "YOUR_OPENAI_API_KEY";  // Replace with your key
  try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: `Provide a short answer for: ${question}` }],
              max_tokens: 50
          })
      });
      
      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
          return data.choices[0].message.content.trim();
      } else {
          console.warn("GPT response empty, using fallback.");
          return "";
      }
  } catch (error) {
      console.error("GPT API Error:", error);
      return ""; // Return empty string so fallback is used
  }
}