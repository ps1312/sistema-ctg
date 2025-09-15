"use client"
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"
import { toast } from "sonner"

export function SignInForm() {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn")
  const [submitting, setSubmitting] = useState(false)

  function login(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    formData.set("flow", flow)

    signIn("password", formData).catch((error) => {
      let toastTitle = ""
      if (error.message.includes("Invalid password")) {
        toastTitle = "Senha inválida. Tente novamente."
      } else {
        toastTitle =
          flow === "signIn"
            ? "Não foi possível fazer login, você quis fazer cadastro?"
            : "Não foi possível fazer cadastro, você quis fazer login?"
      }

      toast.error(toastTitle)
      setSubmitting(false)
    })
  }

  return (
    <div className="w-full">
      <form className="flex flex-col gap-form-field" onSubmit={login}>
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Senha"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Fazer login" : "Fazer cadastro"}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn" ? "Não tem uma conta? " : "Já tem uma conta? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Fazer cadastro" : "Fazer login"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-200" />
        <span className="mx-4 text-secondary">ou</span>
        <hr className="my-4 grow border-gray-200" />
      </div>
      <button className="auth-button" onClick={() => void signIn("anonymous")}>
        Fazer login anonimamente
      </button>
    </div>
  )
}
