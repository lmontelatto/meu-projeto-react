import React from 'react';
import './App.css';
import Header from './Header'; // Importando o componente Header
import NewsList from './NewsList'; // Importando o novo componente NewsList

function App() {
  return (
    <div className="App">
      <NewsList />
    </div>
  );
}

export default App;
