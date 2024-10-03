import { useNavigate } from "react-router-dom"

export const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Welcom to kompitrail</h1>
      <button onClick={()=> navigate("/register")}>Registro</button>
      <button>Login</button>
    </div>
  )
}
