import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AddAnimalForm } from "./components/AddAnimalForm";
import { AnimalsList } from "./components/AnimalsList";
import { TodaysMedications } from "./components/TodaysMedications";
import { AnimalDetails } from "./components/AnimalDetails";
import { Id } from "../convex/_generated/dataModel";

type View = "dashboard" | "add-animal" | "animals-list" | "animal-details";

export function AnimalShelterApp() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedAnimalId, setSelectedAnimalId] = useState<Id<"animals"> | null>(null);

  const animals = useQuery(api.animals.listAnimals) || [];
  const todaysMedications = useQuery(api.medications.getTodaysMedications) || [];

  const handleViewAnimal = (animalId: Id<"animals">) => {
    setSelectedAnimalId(animalId);
    setCurrentView("animal-details");
  };

  const renderContent = () => {
    switch (currentView) {
      case "add-animal":
        return <AddAnimalForm onSuccess={() => setCurrentView("animals-list")} />;
      case "animals-list":
        return <AnimalsList animals={animals} onViewAnimal={handleViewAnimal} />;
      case "animal-details":
        return selectedAnimalId ? (
          <AnimalDetails 
            animalId={selectedAnimalId} 
            onBack={() => setCurrentView("animals-list")} 
          />
        ) : null;
      default:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Animais</h3>
                <p className="text-3xl font-bold text-blue-600">{animals.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medicações Hoje</h3>
                <p className="text-3xl font-bold text-green-600">{todaysMedications.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Administradas</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {todaysMedications.filter(med => med.administrado).length}
                </p>
              </div>
            </div>
            <TodaysMedications medications={todaysMedications} />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <nav className="bg-white border-b mb-6">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentView === "dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </button>
              <button
                onClick={() => setCurrentView("animals-list")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentView === "animals-list"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Lista de Animais
              </button>
            </div>
            <button
              onClick={() => setCurrentView("add-animal")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentView === "add-animal"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Adicionar Animal
            </button>
          </div>
        </div>
      </nav>

      <div className="px-4">
        {renderContent()}
      </div>
    </div>
  );
}
