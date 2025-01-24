import React, { useEffect, useState } from 'react';
import './App.css';
import data from './question.json';
import correct from './sounds/correct.mp3';
import wrong from './sounds/wrong.mp3';
import happyImage from './assets/happyface.jpg'; 
import sadImage from './assets/sadface.jpg';    
function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectOption, setSelectOption] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(10);
  const [answerFeedback, setAnswerFeedback] = useState(null); 

  useEffect(() => {
    let interval;
    if (timer > 0 && !showScore) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      if (currentQuestion < data.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setTimer(10);
        setSelectOption(null);
        setAnswerFeedback(null); 
      } else {
        setShowScore(true);
      }
    }

    return () => clearInterval(interval);
  }, [timer, showScore, currentQuestion]);

  const restartQuiz = () => {
    setSelectOption(null);
    setScore(0);
    setShowScore(false);
    setTimer(10);
    setCurrentQuestion(0);
    setAnswerFeedback(null); 
  };

  const handleClick = (option) => {
    setSelectOption(option);

    if (option === data[currentQuestion].correctOption) {
      setScore((prev) => prev + 1);
      setAnswerFeedback('correct'); 
      const audio = new Audio(correct);
      audio.play();
    } else {
      setAnswerFeedback('wrong'); 
      const audio = new Audio(wrong);
      audio.play();
    }
  };

  return (
    <div className="quiz-app">
      {showScore ? (
        <div className="score-section">
          Score: {score}/{data.length}
          <button onClick={restartQuiz}>Restart</button>
        </div>
      ) : (
        <div className="question-section">
          <h2>QUESTION {currentQuestion + 1}</h2>
          <p>{data[currentQuestion].question}</p>
          <div className="options">
            {data[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleClick(option)}
                className={
                  selectOption
                    ? option === data[currentQuestion].correctOption
                      ? 'correct'
                      : 'wrong'
                    : ''
                }
                disabled={!!selectOption}
              >
                {option}
              </button>
            ))}
          </div>
          {answerFeedback && (
            <div className="feedback-image">
              <img
                src={answerFeedback === 'correct' ? happyImage : sadImage}
                alt={answerFeedback === 'correct' ? 'Happy Face' : 'Sad Face'}
                className="feedback-img"
              />
            </div>
          )}
          <div className="timer">
            Time Left: <span>{timer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
