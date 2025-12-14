import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../apis";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { mutate: login } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일을 입력해주세요");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("비밀번호는 8자 이상 입력해주세요");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: (error: any) => {
          if (error.response?.status === 401) {
            setPasswordError("이메일 또는 비밀번호가 올바르지 않습니다");
          } else {
            setPasswordError(
              "로그인 중 오류가 발생했습니다. 다시 시도해주세요"
            );
          }
        },
      }
    );
  };

  const isButtonActive = email.length > 0 && password.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col px-6 pt-12">
        {/* Logo/Title */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">안녕하세요,</h1>
          <h2 className="text-3xl font-bold text-gray-900">모복입니다</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex-1 flex flex-col">
          <div className="space-y-4 mb-6">
            <div>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                aria-invalid={!!emailError}
                className={`w-full px-4 py-4 text-base border-b-2 outline-none transition-colors placeholder:text-gray-400 ${
                  emailError
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-500">{emailError}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                aria-invalid={!!passwordError}
                className={`w-full px-4 py-4 text-base border-b-2 outline-none transition-colors placeholder:text-gray-400 ${
                  passwordError
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-500">{passwordError}</p>
              )}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isButtonActive}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              isButtonActive
                ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            로그인
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600 text-sm">
              아직 회원이 아니신가요?{" "}
            </span>
            <Link
              to="/signup"
              className="text-blue-500 text-sm font-semibold hover:text-blue-600"
            >
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
