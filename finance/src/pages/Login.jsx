import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGooglePlusG, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import '../styles/global.css';
import { api, setToken } from '../services/api';

export default function Login({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('sign-in-js');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;

    if (!email || !password) {
      setLoginError('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await api.login({ email, password });
      setToken(token);
      onAuthSuccess(user);
    } catch (error) {
      console.error(error);
      setLoginError(error.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    const name = e.target.signupName.value;
    const email = e.target.signupEmail.value;
    const password = e.target.signupPassword.value;

    if (!name || !email || !password) {
      setSignupError('Todos os campos são obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setSignupError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await api.register({ name, email, password });
      setToken(token);
      onAuthSuccess(user);
    } catch (error) {
      console.error(error);
      setSignupError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`app-wrapper ${authMode}`}>
      <div className="auth-container">
        
        {/* TELA DE CADASTRO */}
        <div className="content first-content">
          <div className="first-column">
            <h2 className="title title-primary">Bem-vindo(a) de volta!</h2>
            <p className="description description-primary">Para se manter conectado conosco</p>
            <p className="description description-primary">por favor, faça o login com suas credenciais</p>
            <button id="signin" className="btn btn-primary" onClick={() => setAuthMode('sign-in-js')} disabled={isLoading}>
              Entrar
            </button>
          </div>
          
          <div className="second-column">
            <h2 className="title title-second">Criar Conta</h2>
            <div className="social-media">
              <ul className="list-social-media">
                <a className="link-social-media" href="#"><li className="item-social-media"><FontAwesomeIcon icon={faFacebookF} /></li></a>
                <a className="link-social-media" href="#"><li className="item-social-media"><FontAwesomeIcon icon={faGooglePlusG} /></li></a>
                <a className="link-social-media" href="#"><li className="item-social-media"><FontAwesomeIcon icon={faLinkedinIn} /></li></a>
              </ul>
            </div>
            <p className="description description-second">ou use seu email para registrar:</p>
            <form className="form" onSubmit={handleSignupSubmit} noValidate>
              <label className="label-input">
                <User className="icon-modify" size={18} />
                <input type="text" id="signupName" name="signupName" placeholder="Nome Completo" disabled={isLoading} />
              </label>
              <label className="label-input">
                <Mail className="icon-modify" size={18} />
                <input type="email" id="signupEmail" name="signupEmail" placeholder="Email" disabled={isLoading} />
              </label>
              <label className="label-input">
                <Lock className="icon-modify" size={18} />
                <input type="password" id="signupPassword" name="signupPassword" placeholder="Senha" disabled={isLoading} />
              </label>
              
              {signupError && <p className="text-red-500 text-xs mt-2 text-center font-medium">{signupError}</p>}

              <button type="submit" className="btn btn-second" disabled={isLoading}>
                {isLoading ? 'Aguarde...' : 'Cadastrar'}
              </button>
            </form>
          </div>
        </div>

        {/* TELA DE LOGIN */}
        <div className="content second-content">
          <div className="first-column">
            <h2 className="title title-primary">Olá, amigo(a)!</h2>
            <p className="description description-primary">Insira seus dados pessoais</p>
            <p className="description description-primary">e comece a controlar suas finanças</p>
            <button id="signup" className="btn btn-primary" onClick={() => setAuthMode('sign-up-js')} disabled={isLoading}>
              Cadastrar
            </button>
          </div>
          
          <div className="second-column">
            <h2 className="title title-second">Acessar Sistema</h2>
            <div className="social-media">
              <ul className="list-social-media">
                <a className="link-social-media" href="#"><li className="item-social-media"><FontAwesomeIcon icon={faFacebookF} /></li></a>
                <a className="link-social-media" href="#"><li className="item-social-media"><FontAwesomeIcon icon={faGooglePlusG} /></li></a>
                <a className="link-social-media" href="#"><li className="item-social-media"><FontAwesomeIcon icon={faLinkedinIn} /></li></a>
              </ul>
            </div>
            <p className="description description-second">ou use sua conta de email:</p>
            <form className="form" onSubmit={handleLoginSubmit} noValidate>
              <label className="label-input">
                <Mail className="icon-modify" size={18} />
                <input type="email" id="loginEmail" name="loginEmail" placeholder="Email" disabled={isLoading} />
              </label>
              <label className="label-input">
                <Lock className="icon-modify" size={18} />
                <input type="password" id="loginPassword" name="loginPassword" placeholder="Senha" disabled={isLoading} />
              </label>

              <a className="password" href="#">Esqueceu sua senha?</a>
              
              {loginError && <p className="text-red-500 text-xs mb-2 text-center font-medium">{loginError}</p>}

              <button type="submit" className="btn btn-second" disabled={isLoading}>
                {isLoading ? 'Aguarde...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
