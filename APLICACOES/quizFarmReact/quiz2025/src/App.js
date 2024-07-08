import React, { useState } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import Question from './components/Question';
import Result from './components/Result';
import { questions } from './utils/data';
import './App.css'; // Importe seus estilos globais aqui

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="App">
      
      <Header />
      {showResult ? (
        <Result />
      ) : (
        <Question
          question={questions[currentQuestion]}
          onNextQuestion={handleNextQuestion}
        />
      )}
 <Modal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
}

export default App;
