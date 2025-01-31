import React from "react"
import UserForm from "./UserForm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [loginResponse, setLoginResponse] = useState()
  let navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }

    fetch("http://localhost:4000/user/login", options)
      .then((res) => res.json())
      .then((json) => {
        setLoginResponse("Logged In with token:" + json.data)
        localStorage.setItem("jwt", json.data)
        navigate("/movieList")
      })
  }

  return (
    <>
      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />
      <p>{loginResponse}</p>
    </>
  )
}
