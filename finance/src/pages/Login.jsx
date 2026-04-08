import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
// Importando o FontAwesome padrão do React
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGooglePlusG, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
// Importa as animações que criamos no arquivo CSS global
import '../styles/global.css';

export default function Login({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('sign-in-js');
  
  // Estados para as mensagens de erro
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(''); // Limpa qualquer erro anterior
    
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;

    // VALIDAÇÃO: Verifica se os campos estão vazios
    if (!email || !password) {
      setLoginError('Por favor, preencha o e-mail e a senha.');
      return; // Interrompe a função aqui
    }

    // No futuro, a chamada para o banco de dados (Node.js) entrará aqui!
    onLoginSuccess({ name: "Luana Garcia", email: email });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError(''); // Limpa qualquer erro anterior
    
    const name = e.target.signupName.value;
    const email = e.target.signupEmail.value;
    const password = e.target.signupPassword.value;

    // VALIDAÇÃO 1: Campos Vazios
    if (!name || !email || !password) {
      setSignupError('Todos os campos são obrigatórios.');
      return;
    }

    // VALIDAÇÃO 2: Formato de E-mail (Expressão Regular simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSignupError('Por favor, insira um e-mail válido.');
      return;
    }

    // VALIDAÇÃO 3: Tamanho da Senha
    if (password.length < 6) {
      setSignupError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // No futuro, o envio para criar a conta no banco de dados (Node.js) entrará aqui!
    onLoginSuccess({ name: name, email: email });
  };

  return (
    <div className={`app-wrapper ${authMode}`}>
      <div className="auth-container">
        
        {/* ================================== */}
        {/* LADO 1: TELA DE CADASTRO (SIGN UP) */}
        {/* ================================== */}
        <div className="content first-content">
          <div className="first-column">
            <h2 className="title title-primary">Bem-vindo(a) de volta!</h2>
            <p className="description description-primary">Para se manter conectado conosco</p>
            <p className="description description-primary">por favor, faça o login com suas credenciais</p>
            <button id="signin" className="btn btn-primary" onClick={() => setAuthMode('sign-in-js')}>
              Entrar
            </button>
          </div>
          
          <div className="second-column">
            <h2 className="title title-second">Criar Conta</h2>
            <div className="social-media">
              <ul className="list-social-media">
                <a className="link-social-media" href="#">
                  <li className="item-social-media">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </li>
                </a>
                <a className="link-social-media" href="#">
                  <li className="item-social-media">
                    <FontAwesomeIcon icon={faGooglePlusG} />
                  </li>
                </a>
                <a className="link-social-media" href="#">
                  <li className="item-social-media">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </li>
                </a>
              </ul>
            </div>
            <p className="description description-second">ou use seu email para registrar:</p>
            <form className="form" onSubmit={handleSignupSubmit} noValidate>
              <label className="label-input">
                <User className="icon-modify" size={18} />
                <input type="text" id="signupName" name="signupName" placeholder="Nome Completo" />
              </label>
              <label className="label-input">
                <Mail className="icon-modify" size={18} />
                <input type="email" id="signupEmail" name="signupEmail" placeholder="Email" />
              </label>
              <label className="label-input">
                <Lock className="icon-modify" size={18} />
                <input type="password" id="signupPassword" name="signupPassword" placeholder="Senha" />
              </label>
              
              {/* Exibição condicional da mensagem de erro */}
              {signupError && (
                <p className="text-red-500 text-xs mt-2 text-center font-medium">{signupError}</p>
              )}

              <button type="submit" className="btn btn-second">Cadastrar</button>
            </form>
          </div>
        </div>

        {/* ================================== */}
        {/* LADO 2: TELA DE LOGIN (SIGN IN)    */}
        {/* ================================== */}
        <div className="content second-content">
          <div className="first-column">
            <h2 className="title title-primary">Olá, amigo(a)!</h2>
            <p className="description description-primary">Insira seus dados pessoais</p>
            <p className="description description-primary">e comece a controlar suas finanças</p>
            <button id="signup" className="btn btn-primary" onClick={() => setAuthMode('sign-up-js')}>
              Cadastrar
            </button>
          </div>
          
          <div className="second-column">
            <h2 className="title title-second">Acessar Sistema</h2>
            <div className="social-media">
              <ul className="list-social-media">
                <a className="link-social-media" href="#">
                  <li className="item-social-media">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </li>
                </a>
                <a className="link-social-media" href="#">
                  <li className="item-social-media">
                    <FontAwesomeIcon icon={faGooglePlusG} />
                  </li>
                </a>
                <a className="link-social-media" href="#">
                  <li className="item-social-media">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </li>
                </a>
              </ul>
            </div>
            <p className="description description-second">ou use sua conta de email:</p>
            <form className="form" onSubmit={handleLoginSubmit} noValidate>
              <label className="label-input">
                <Mail className="icon-modify" size={18} />
                <input type="email" id="loginEmail" name="loginEmail" placeholder="Email" />
              </label>
              <label className="label-input">
                <Lock className="icon-modify" size={18} />
                <input type="password" id="loginPassword" name="loginPassword" placeholder="Senha" />
              </label>

              <a className="password" href="#">Esqueceu sua senha?</a>
              
              {/* Exibição condicional da mensagem de erro */}
              {loginError && (
                <p className="text-red-500 text-xs mb-2 text-center font-medium">{loginError}</p>
              )}

              <button type="submit" className="btn btn-second">Entrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}