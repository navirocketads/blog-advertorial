import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Modal.css'; // Importe o arquivo de estilos CSS

const CustomModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title className="text-center">
          <strong>Quiz Exclusivo Farm Rio</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Seja bem-vindo(a) ao nosso quiz especial! Aqui na Farm Rio, celebramos o estilo tropical com um toque extra de autenticidade.
          Junte-se a nós nesta jornada de moda e ao final, ganhe uma mala de Bordo! Afinal, na Farm Rio, cada peça é uma celebração da sua própria autenticidade.
          Pronto para começar?
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={handleClose}>
          COMEÇAR
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
