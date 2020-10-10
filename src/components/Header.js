import React from 'react';
import logo from '../images/logo.svg';
import { NavLink, Route } from 'react-router-dom';

function Header(props) {

  const [screenWidth, setScreenWidth] = React.useState('');
  const [isMenuMobile, setIsMenuMobile] = React.useState(false);

  function updateScreenWidth() {
    setScreenWidth(window.innerWidth);
  }
  React.useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener('resize', updateScreenWidth);
    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  function handleMenuMobileOpen() {
    setIsMenuMobile(!isMenuMobile);
  }

  function handleMenuMobileClose() {
    setIsMenuMobile(false);
    props.onSignOut();
  }

  const nav = (
    <nav className={props.loggedInEmail ? "header__nav header__nav_mobile" : "header__nav"}>
      <Route path="/sign-up">
        <NavLink className="header__link" to="/sign-in">Войти</NavLink>
      </Route>
      <Route path="/sign-in">
        <NavLink className="header__link" to="/sign-up">Регистрация</NavLink>
      </Route>
      <Route exact path="/">
        <p className="header__email">{props.loggedInEmail}</p>
        <button className="header__button" onClick={handleMenuMobileClose} type="button">Выйти</button>
      </Route>
    </nav>
  );

  const hamburgerMenuMobile = (
    <button className={`header__hamburger-menu ${isMenuMobile ? "header__hamburger-menu_active" : ""}`} type="button"
      onClick={handleMenuMobileOpen}>
      <span className="header__hamburger-line" />
      <span className="header__hamburger-line" />
      <span className="header__hamburger-line" />
    </button>
  );

  return (
    <>
      {(screenWidth < 501 && isMenuMobile && props.loggedInEmail && nav)}
      <header className="header" >
        <img className="header__logo" src={logo} alt="Логотип. Россия. Место" />
        {(screenWidth < 501) && (props.loggedInEmail ? hamburgerMenuMobile : nav)}
        {(screenWidth < 501) ? "" : nav}
      </header>
    </>
  );
}

export default Header;
