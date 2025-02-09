chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchGPTResponse") {
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{"role": "user", "content": request.question}]
        })
      })
        .then(response => response.json())
        .then(data => sendResponse({ answer: data.choices[0].message.content }))
        .catch(error => sendResponse({ error: error.message }));
      return true;
    }
  });