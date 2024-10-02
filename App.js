import React from 'react';
import './App.css';
import Header from './src/components/helper/Header-Helper';
import Sidebar from './src/components/Sidebar';
import SidebarInterna from './src/components/SidebarInterna'; // Certifique-se de ajustar o caminho conforme necessário
import Main from './src/components/Main';

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <Sidebar />
        <SidebarInterna />
        <Main />
      </div>
    </div>
  );
};

export default App;
