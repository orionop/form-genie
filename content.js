const questions = document.querySelectorAll(".Qr7Oae");
const previousAnswers = {};

questions.forEach((question, index) => {
  const questionText = question.innerText;
  let prompt = "Answer this question: " + questionText;
  
  if (Object.keys(previousAnswers).length > 0) {
    prompt += "\nConsider previous answers: " + JSON.stringify(previousAnswers);
  }

  chrome.runtime.sendMessage({ action: "fetchGPTResponse", question: prompt }, response => {
    if (response.answer) {
      const inputField = document.querySelectorAll("input, textarea")[index];
      if (inputField) {
        inputField.value = response.answer;
        previousAnswers[questionText] = response.answer;
      }
    }
  });
});