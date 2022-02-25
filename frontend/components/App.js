import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ navigate('/')}
  const redirectToArticles = () => { /* ✨ implement */ navigate('/articles')}

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    console.log('logging out');
    if(localStorage.getItem('token')){
      setMessage('Goodbye!');
      localStorage.removeItem('token');
    }
    // navigate('/');
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    
    axios.post('http://localhost:9000/api/login', {username, password})
    .then(resp => {
      console.log('login axios resp: ', resp);
      localStorage.setItem('token', resp.data.token)
      console.log('herererere: ', resp.data.message)
      setMessage(resp.data.message);
      redirectToArticles()
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setSpinnerOn(false);
    })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login..
    // Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().get('http://localhost:9000/api/articles')
    .then(resp => {
      console.log('getArticles axiosWithAuth resp: ', resp)
      setMessage(resp.data.message)
      setArticles(resp.data.articles)
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setSpinnerOn(false);
    })

  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    axiosWithAuth().post('http://localhost:9000/api/articles', article)
    .then(resp => {
      console.log('postArticls axiosWithAuth resp: ', resp)
      setArticles([
        ...articles,
        resp.data.article
      ])
      setMessage(resp.data.message)
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setSpinnerOn(false);
    })
    // setSpinnerOn(true);
    // axiosWithAuth().post('http://localhost:9000/api/articles', {headers: {
    //   Authorization: localStorage.getItem('token')
    // }})
    // .then(resp => {
    //   console.log('getArticles axiosWithAuth resp: ', resp)
    //   setArticles(resp.data.articles)
    // })
    // .catch(error => {
    //   console.log(error);
    // })
    // .finally(() => {
    //   setSpinnerOn(false);
    // })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement

    
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
    .then(resp => {
      console.log('deleteArticle resp: ', resp)
      setArticles(articles.filter(item => {
        return item.article_id !== article_id
      }))
      setMessage(resp.data.message)

    })
    .catch(error => {
      console.log('promise returned an error');
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
