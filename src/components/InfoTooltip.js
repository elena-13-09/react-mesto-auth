import React from 'react';
import success from '../images/success.svg';
import error from '../images/error.svg';

function InfoTooltip(props) {
  return (
    <section className={`popup ${props.isOpen && "popup_opened"}`}>
      <div className="form__container form__container_tooltip">
        <button className="button__close" type="button" onClick={props.onClose}></button>
        <img className="popup__tooltip-image" src={props.isInfoTooltip ? success : error} alt="Статус регистрации" />
        <h2 className="popup__tooltip-message">{props.isInfoTooltip ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</h2>
      </div>
    </section>
  );
}

export default InfoTooltip;
