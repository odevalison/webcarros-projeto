import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import { Container } from "../../components/container";
import { RegisterForm } from "../../components/register-form";

export function Register() {
  return (
    <Container>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <Link to="/" className="mb-6 w-full max-w-xs">
          <img src={logoImg} alt="Logo WebCarros" className="w-full" />
        </Link>

        <RegisterForm />

        <p>
          Já possui uma conta?{" "}
          <Link to="/login" className="underline">
            Faça login
          </Link>
        </p>
      </div>
    </Container>
  );
}
