import React from 'react';
import './Result.css'; // Importe o arquivo de estilos CSS

const Result = ({ answers }) => (
  <div className="card finalizacao">
    <div className="finalizacao__titulo">
      <h2 className="titulo-negrito-preto">VOCÊ GANHOU!</h2>
    </div>
    <div className="finalizacao__trofeu">
      <img src="images/presente.png" alt="Troféu de presente" />
    </div>
    <div className="finalizacao__descricao">
      <p>Você concluiu nossa avaliação da Farm Rio e ganhou uma <b>Mala de Bordo Exclusiva</b>! Clique no botão <b>RESGATAR</b> abaixo para resgatar seu prêmio.</p>
      <p>Agradecemos sua participação e esperamos que desfrute do seu kit cheio de carinho e encanto da Farm Rio.<br /><br />Com carinho,<br />Equipe Farm Rio.</p>
    </div>
    <div className="finalizacao__botao">
      <a href="https://produto.resgatebagagem.shop/index.html" id="umdoistrestplink1"><button><i className="fa-solid fa-gift"></i>  RESGATAR</button></a>
    </div>
  </div>
);

export default Result;
