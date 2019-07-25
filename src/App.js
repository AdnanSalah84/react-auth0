import React from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';

function App() {
  return (
    <>
    <Route path="/" exact component={Home} />
    <Route path="/profile" component={Profile} />
    </>
  );
}

export default App;
