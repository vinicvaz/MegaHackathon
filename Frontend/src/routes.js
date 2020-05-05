import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './pages/Home'

import Profile from './pages/Profile'

import Questions from './pages/Questions'

import AddProduct from './pages/AddProduct'

import { Navbar, QuestionForm, DeleteProduct, CreateQuestion } from './components'

export default function Routes() {
  return (
    <BrowserRouter>
            <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/questions" component={Questions} />
        <Route path="/add" component={AddProduct} />
        <Route path="/delete" component={DeleteProduct} />
        <Route path="/answer-question" component={QuestionForm} />
        <Route path="/create-question" component={CreateQuestion} />
      </Switch>
    </BrowserRouter>
  )
}
