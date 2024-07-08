import React, { useState } from 'react';
import './Question.css';

const Question = ({ question, onNextQuestion }) => {
  const [selectedResponse1, setSelectedResponse1] = useState(null);
  const [selectedResponse2, setSelectedResponse2] = useState(null);
  const [selectedResponse3, setSelectedResponse3] = useState(null);

  const handleResponse1Select = (response) => {
    setSelectedResponse1(response);
  };

  const handleResponse2Select = (response) => {
    setSelectedResponse2(response);
  };

  const handleResponse3Select = (response) => {
    setSelectedResponse3(response);
  };

  const handleNextClick = () => {
    if (selectedResponse1 !== null && selectedResponse2 !== null && selectedResponse3 !== null) {
      setSelectedResponse1(null); // Reseta a primeira resposta
      setSelectedResponse2(null); // Reseta a segunda resposta
      setSelectedResponse3(null); // Reseta a terceira resposta
      onNextQuestion();
    }
  };

  return (
    <div className="card">
      <div className="card__logo">
        <img src={question.image} alt="" />
      </div>
      <div className="card__resposta">
        <h2>{question.responseQuestion1}</h2>
        <div className="resposta__gradeContainer full-width">
          {question.responses1.map((response, index) => (
            <div
              className={`resposta__grade resposta1 ${selectedResponse1 === response ? 'active' : ''}`}
              key={index}
              onClick={() => handleResponse1Select(response)}
            >
              <p>{response}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card__resposta">
        <h2>{question.responseQuestion2}</h2>
        <div className="resposta__gradeContainer full-width">
          {question.responses2.map((response, index) => (
            <div
              className={`resposta__grade resposta2 ${selectedResponse2 === response ? 'active' : ''}`}
              key={index}
              onClick={() => handleResponse2Select(response)}
            >
              <p>{response}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card__resposta">
        <h2>{question.responseQuestion3}</h2>
        <div className="resposta__gradeContainer full-width">
          {question.responses3.map((response, index) => (
            <div
              className={`resposta__grade resposta3 ${selectedResponse3 === response ? 'active' : ''}`}
              key={index}
              onClick={() => handleResponse3Select(response)}
            >
              <p>{response}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`card__enviarResposta ${selectedResponse1 !== null && selectedResponse2 !== null && selectedResponse3 !== null ? 'active' : ''}`}
        onClick={handleNextClick}
        disabled={selectedResponse1 === null || selectedResponse2 === null || selectedResponse3 === null}
      >
        Enviar avaliação
      </button>
    </div>
  );
};

export default Question;
