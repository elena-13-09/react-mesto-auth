import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithConfirm from './PopupWithConfirm';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isZoomPopupOpen, setIsZoomPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState();
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '', avatar: '' });
  const [cardDelete, setCardDelete] = React.useState([]);
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  // статус пользователя — вошёл он в систему или нет
  const [loggedIn, setLoggedIn] = React.useState(false);
  // хранение email пользователя
  const [loggedInEmail, setLoggedInEmail] = React.useState('');
  // попап модального окна
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
  // для смены стиля модального окна
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    Promise.all([
      api.getUserInfo(),
      api.getInitialCards()
    ])
      .then(([user, initialCards]) => {
        setCurrentUser(user);
        setCards(initialCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Открытие попапов
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleConfirmPopupClick() {
    setIsConfirmPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(true);
    setIsZoomPopupOpen(card);
  }

  function handleCardDelete(card) {
    setCardDelete(card)
    handleConfirmPopupClick();
  }

  function handleInfoTooltip() {
    setIsInfoTooltipPopupOpen(true);
  }

  // Закрытие попопов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setIsConfirmPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  }

  // Сохранение токена в локальное хранилище
  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      // проверяем токен пользователя
      auth.getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setLoggedInEmail(res.data.email);
            history.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  // Проверка токена
  React.useEffect(() => {
    tokenCheck();
  }, []);

  // Регистрация
  function handleRegister(email, password) {
    auth.register(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setIsInfoTooltipSuccess(true);
          handleInfoTooltip();
          history.push('/sign-in');
        }
      })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltipSuccess(false);
        handleInfoTooltip();
      });
  }

  // Авторизация
  function handleLogin(email, password) {
    auth.authorize(email, password)
      .then((res) => {
        if (res && res.token) {
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
          setLoggedInEmail(email);
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
        handleInfoTooltip();
        setIsInfoTooltipSuccess(false);
      })
  }

  // Выход
  function handleSignOut() {
    setLoggedIn(false);
    setLoggedInEmail('');
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  // Лайки
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        const newCards = cards.map((c) => c._id === card._id ? newCard : c);
        // Обновляем стейт
        setCards(newCards);
      });
  }

  // Удаление карточки
  function handleCardDeleteSubmit() {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.deleteCard(cardDelete._id)
      .then(() => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        const newCards = cards.filter((i) => i._id !== cardDelete._id);
        // Обновляем стейт
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
      });
  }

  // Редактирование профиля
  function handleUpdateUser(user) {
    setIsLoading(true);
    api.editUserInfo(user)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }

  // Изменение аватара
  function handleUpdateAvatar(user) {
    setIsLoading(true);
    api.editUserAvatar(user)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }

  // Добавление карточки
  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api.addNewCard(card)
      .then((res) => {
        setCards([...cards, res]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedInEmail={loggedInEmail} onSignOut={handleSignOut} />
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn} component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Route path='/sign-up'>
            <Register
              onRegister={handleRegister}
            />
          </Route>
          <Route path='/sign-in'>
            <Login
              onLogin={handleLogin}
            />
          </Route>
          <Route>
            {loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}
          </Route>
        </Switch>
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          isInfoTooltip={isInfoTooltipSuccess}
          onClose={closeAllPopups}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />
        <ImagePopup
          isOpen={selectedCard}
          card={isZoomPopupOpen}
          onClose={closeAllPopups}
        />
        <PopupWithConfirm
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDeleteSubmit}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;


