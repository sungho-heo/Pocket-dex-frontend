import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import queryClient from "./queryClient";
import { createGlobalStyle } from "styled-components";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import PokemonDetail from "./components/PokemonDetail";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {/* 라우터 설정. */}
      <Router>
        <AuthProvider>
          <div className="App">
            {/* 해당 프로젝트에서 사용하는 기반의 css스타일 작성.*/}
            <GlobalStyle />
            {/* 공통 header */}
            <Header />
            {notification && (
              <Notification
                message={notification}
                onClose={handleNotificationClose}
              />
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pokemon/:name" element={<PokemonDetail />} />
              <Route
                path="/signup"
                element={<Signup showNotification={showNotification} />}
              />
              <Route
                path="/login"
                element={<Login showNotification={showNotification} />}
              />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
      <Footer />
    </QueryClientProvider>
  );
};

// css
// 글로벌 스타일 정의
const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
      margin: 0;
  }

  :root{
    margin: 0 auto;
    text-align: center;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }
  a:hover {
    color: #535bf2;
  }
`;

export default App;
