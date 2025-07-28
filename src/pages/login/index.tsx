import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import { Container } from "../../components/container";
import { LoginForm } from "../../components/login-form";

export function Login() {
  return (
    <Container>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <Link to="/" className="mb-6 w-full max-w-xs">
          <img src={logoImg} alt="Logo WebCarros" className="w-full" />
        </Link>

        <LoginForm />

        <p>
          Ainda não possui uma conta?{" "}
          <Link to="/register" className="underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </Container>
  );
}
