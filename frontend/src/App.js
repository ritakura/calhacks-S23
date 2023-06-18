import React, { useState, useEffect } from 'react';

import './App.css';

// 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

function App() {
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [resp, setResp] = useState('Response here...');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    console.log("==> url: ", url);
  }

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
    console.log("==> prompt: ", prompt);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("url", url);
    console.log("prompt", prompt);

    if (url && prompt) {
      var data = {
        url: url,
        prompt: prompt,
      }

      console.log("this is returning empty", JSON.stringify(data));
      
      fetch('http://localhost:3001/api', {
        method: 'POST',
        headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        body: JSON.stringify(data),
      }).then((response) => response.json())
        .then((json) => {
          console.log(json.response);
          setResp(json.response);
        })
    } else {
      console.log("failed; url or prompt missing");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <span className="first">Prompt</span><span className="second">Scrapr</span>
      </header>
      <div class="container">
        <form onSubmit={handleSubmit} class="input">
          <input class="url search" type="url" placeholder="URL here..." value={url} onChange={handleUrlChange} required/>
          <input class="prompt search" type="text" placeholder="Prompt here..." value={prompt} onChange={handlePromptChange} required/>
          <input class="submit" type="submit" value="Submit"/>
        </form>
        <div class="output">
          { resp }
        </div>
      </div>
    </div>
  );
}

export default App;