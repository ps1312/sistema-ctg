import { Authenticated, Unauthenticated, useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { SignInForm } from "./SignInForm"
import { SignOutButton } from "./SignOutButton"
import { Toaster } from "sonner"
import { AnimalShelterApp } from "./AnimalShelterApp"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-blue-600">
            🐾 Controle de Internamento
          </h2>
        </div>

        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>

      <main className="flex-1">
        <Content />
      </main>

      <Toaster />
    </div>
  )
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser)

  // loading session
  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <Authenticated>
        <AnimalShelterApp />
      </Authenticated>

      <Unauthenticated>
        <div className="max-w-md mx-auto mt-20">
          <div className="text-center">
            <img
              src="/logo-3.svg"
              alt="Logo"
              className="h-52 w-52 mx-auto object-contain rounded-md mb-16"
              loading="eager"
              decoding="async"
            />

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Controle de Medicamentos
            </h1>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  )
}
