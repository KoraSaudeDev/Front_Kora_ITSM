import React from 'react';
import './App.css';
import Header from './src/components/Header';
import Sidebar from './src/components/Sidebar';
import Main from './src/components/Main';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Sidebar />
      <Main />
    </div>
  );
};

export default App;
