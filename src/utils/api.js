import { BASE_URL } from './utils';

//получить ответ
const response = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error ${res.status}`);
}

//получить массив карточек с сервера
export const getInitialCards = (token) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(response);
}

//получить данные пользователя
export const getUserInfo = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(response);
}

//обновить данные пользователя
export const editUserInfo = (data, token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      about: data.about
    }),
  })
    .then(response);
}

//добавление новой карточки на сервер
export const addNewCard = (data, token) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      link: data.link
    }),
  })
    .then(response);
}

//удаление карточки
export const deleteCard = (id, token) => {
  return fetch(`${BASE_URL}/cards/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response);
}

//добавление лайков
export const changeLikeCardStatus = (id, status, token) => {
  return fetch(`${BASE_URL}/cards/${id}/likes/`, {
    method: `${(status) ? `PUT` : `DELETE`}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(response);
}

//редактирование аватара
export const editUserAvatar = (user, token) => {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      avatar: user.avatar
    })
  })
    .then(response);
}


