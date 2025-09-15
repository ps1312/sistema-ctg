import { useState } from "react"
import { useQuery } from "convex/react"
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom"
import { api } from "../convex/_generated/api"
import { AddAnimalForm } from "./components/AddAnimalForm"
import { AnimalsList } from "./components/AnimalsList"
import { TodaysMedications } from "./components/TodaysMedications"
import { AnimalDetails } from "./components/AnimalDetails"
import { Id } from "../convex/_generated/dataModel"

// Navigation component
function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="bg-white border-b mb-6">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/") && location.pathname === "/"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/animals"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/animals")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Lista de Animais
            </Link>
          </div>
          <Link
            to="/add-animal"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
          >
            + Adicionar Animal
          </Link>
        </div>
      </div>
    </nav>
  )
}

// Dashboard component
function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value
    const [year, month, day] = dateString.split("-").map(Number)
    const newDate = new Date(year, month - 1, day)
    setSelectedDate(newDate)
  }

  const animals = useQuery(api.animals.listAnimals) || []
  const medicationsQueryResult = useQuery(
    api.medications.getMedicationsByDate,
    {
      date: formatDate(selectedDate),
    }
  )
  const medicationsForDate = medicationsQueryResult || []
  const isLoadingMedications = medicationsQueryResult === undefined

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total de Animais
          </h3>
          <p className="text-3xl font-bold text-blue-600">{animals.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Medicações Hoje
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {medicationsForDate.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Administradas
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {medicationsForDate.filter((med) => med.administered).length}
          </p>
        </div>
      </div>
      <TodaysMedications
        medications={medicationsForDate}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        formatDate={formatDate}
        isLoading={isLoadingMedications}
      />
    </div>
  )
}

// Animals List component wrapper
function AnimalsListPage() {
  const animals = useQuery(api.animals.listAnimals) || []
  const navigate = useNavigate()

  const handleViewAnimal = (animalId: Id<"animalsEn">) => {
    navigate(`/animals/${animalId}`)
  }

  return <AnimalsList animals={animals} onViewAnimal={handleViewAnimal} />
}

// Add Animal component wrapper
function AddAnimalPage() {
  const navigate = useNavigate()

  return <AddAnimalForm onSuccess={() => navigate("/animals")} />
}

// Animal Details component wrapper
function AnimalDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Animal ID not provided.</p>
        <button
          onClick={() => navigate("/animals")}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Voltar para lista
        </button>
      </div>
    )
  }

  return (
    <AnimalDetails
      animalId={id as Id<"animalsEn">}
      onBack={() => navigate("/animals")}
    />
  )
}

export function AnimalShelterApp() {
  return (
    <div className="max-w-[90vw] xl:max-w-[95vw] 2xl:max-w-[1600px] mx-auto">
      <Navigation />
      <div className="px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/animals" element={<AnimalsListPage />} />
          <Route path="/animals/:id" element={<AnimalDetailsPage />} />
          <Route path="/add-animal" element={<AddAnimalPage />} />
        </Routes>
      </div>
    </div>
  )
}
