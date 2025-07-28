import { Id } from "../../convex/_generated/dataModel";
import { HealthStatus } from "./health-status";

interface Animal {
  _id: Id<"animals">;
  nome: string;
  sexo: "Macho" | "Fêmea";
  pelagem: string;
  idade: string;
  nomeTutor: string;
  tratamentoPara: string;
  tratamento: string;
  fiv?: boolean;
  felv?: boolean;
  raiva?: boolean;
  v6?: boolean;
}

interface AnimalsListProps {
  animals: Animal[];
  onViewAnimal: (animalId: Id<"animals">) => void;
}

export function AnimalsList({ animals, onViewAnimal }: AnimalsListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lista de Animais</h2>
        <p className="text-gray-600">{animals.length} animais cadastrados</p>
      </div>

      {animals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhum animal cadastrado ainda.</p>
          <p className="text-gray-400 mt-2">Adicione o primeiro animal para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <div key={animal._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{animal.nome}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  animal.sexo === "Macho" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-pink-100 text-pink-800"
                }`}>
                  {animal.sexo}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">Pelagem:</span> {animal.pelagem}</p>
                <p><span className="font-medium">Idade:</span> {animal.idade}</p>
                <p><span className="font-medium">Tutor:</span> {animal.nomeTutor}</p>
                <p><span className="font-medium">Tratamento para:</span> {animal.tratamentoPara}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Tratamento:</p>
                <p className="text-sm text-gray-600 line-clamp-3">{animal.tratamento}</p>
              </div>

              <div className="mb-4">
                <HealthStatus
                  data={{
                    fiv: animal.fiv || false,
                    felv: animal.felv || false,
                    raiva: animal.raiva || false,
                    v6: animal.v6 || false
                  }}
                  editMode={false}
                />
              </div>

              <button
                onClick={() => onViewAnimal(animal._id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
              >
                Ver Detalhes e Medicações
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
