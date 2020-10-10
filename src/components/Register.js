import React from 'react';
import { Link } from 'react-router-dom';

function Register(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();
    props.onRegister(email, password);
  }

  return (
    <section className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h3 className="auth__title">Регистрация</h3>
        <fieldset
          className="auth__field">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="auth__input"
            value={email}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            minLength="5"
            maxLength="40"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="auth__input"
            value={password}
            type="password"
            name="password"
            id="password"
            placeholder="Пароль"
            minLength="2"
            maxLength="8"
            required
          />
        </fieldset>
        <button className="auth__submit" type="submit" >Зарегистрироваться</button>
        <div className="auth__signin">
          <p className="auth__signin-paragraf">Уже зарегистрированы?</p>
          <Link className="auth__login-link" to="/sign-in">Войти</Link>
        </div>
      </form>
    </section>
  );
}

export default Register;
