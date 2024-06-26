import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  inputContainer as LoginContainer,
  pageTitle as Title,
  FormGroup,
  Label,
  Input,
  Button,
} from "../styles/CommonStyles";
import { login, LoginParams, AuthResponse } from "../api/auth";
import { fetchFav } from "../api/fav";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  showNotification: (message: string) => void;
}

const Login: React.FC<LoginProps> = ({ showNotification }) => {
  const { login: loginUser, setFav } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation<AuthResponse, Error, LoginParams>({
    mutationFn: login,
    onSuccess: async (data) => {
      // token localStorage에 저장함.
      localStorage.setItem("token", data.token);

      // 사용자의 즐겨찾기 정보를 갖고옴.
      const favData = await fetchFav(data.token);

      // 즐겨찾기 정보 저장
      setFav(favData);

      // 토큰 설정후 홈으로 이동.
      loginUser(data.token);
      navigate("/");
      showNotification("Login successful!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <LoginContainer>
      <Title>Login</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button type="submit">Login</Button>
      </form>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </LoginContainer>
  );
};

export default Login;
