// src/NewsList.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Importa o arquivo CSS

function NewsList() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para a pesquisa
  const [hasSearched, setHasSearched] = useState(false); // Estado para controlar se a pesquisa foi realizada

  const apiKeyNewsAPI = '440317c0c2ab480e9a1c1d1f0c734819'; // Chave da News API
  const apiKeyGNews = '548e6bd392f5d078343e78e837089921'; // Chave da GNews API

  const fetchNews = async (query) => {
    if (!apiKeyNewsAPI || !apiKeyGNews) {
      setError("Chaves da API não fornecidas. Verifique sua configuração.");
      return;
    }

    setLoading(true); // Inicia o carregamento

    const newsAPIUrl = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${apiKeyNewsAPI}`;
    const gNewsAPIUrl = `https://gnews.io/api/v4/search?q=${query}&token=${apiKeyGNews}`;

    try {
      const [newsAPIResponse, gNewsResponse] = await Promise.all([
        axios.get(newsAPIUrl),
        axios.get(gNewsAPIUrl)
      ]);

      // Combina os resultados de ambas as APIs
      const combinedResults = [
        ...newsAPIResponse.data.articles.map(normalizeArticle),
        ...gNewsResponse.data.articles.map(normalizeArticle)
      ];

      setNewsData(combinedResults);
      setHasSearched(true); // Define que a pesquisa foi realizada
    } catch (err) {
      setError(err.message || "Erro ao buscar notícias. Tente novamente mais tarde.");
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const normalizeArticle = (article) => ({
    title: article.title || article.headline,
    description: article.content || article.summary || article.description,
    url: article.url || article.link,
    publishedAt: article.publishedAt || article.date,
    source: article.source || article.source.name, // Adiciona o nome do veículo
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (searchTerm.trim()) {
      fetchNews(searchTerm); // Chama a função de busca com o termo de pesquisa
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>; // Exibe mensagem de erro

  return (
    <div className="news-container">
      <h1 className="news-title">Busca News</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Buscar notícias..."
          value={searchTerm}
          onChange={handleSearch} // Atualiza o estado da pesquisa
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
      <ul className="news-list">
        {hasSearched && newsData.length > 0 ? (
          newsData.map((news) => (
            <li key={news.id}>
              <h2 style={{ fontSize: '1.2em' }}>{news.title}</h2> {/* Tamanho do título reduzido */}
              <p style={{ fontSize: '0.9em', color: '#555' }}>
                {new Date(news.publishedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p> {/* Exibe a data abaixo do título */}
              <p>{news.description}</p>
              <a href={news.url} target="_blank" rel="noopener noreferrer">Leia mais</a>
            </li>
          ))
        ) : hasSearched ? (
          <p>Nenhuma notícia encontrada.</p>
        ) : null}
      </ul>
    </div>
  );
}

export default NewsList;
