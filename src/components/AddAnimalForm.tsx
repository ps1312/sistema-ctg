import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AddAnimalFormProps {
  onSuccess: () => void;
}

export function AddAnimalForm({ onSuccess }: AddAnimalFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    sexo: "Macho" as "Macho" | "Fêmea",
    pelagem: "",
    idade: "",
    nomeTutor: "",
    tratamentoPara: "",
    tratamento: "",
  });

  const addAnimal = useMutation(api.animals.addAnimal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.pelagem.trim() || !formData.idade.trim() || 
        !formData.nomeTutor.trim() || !formData.tratamentoPara.trim() || !formData.tratamento.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      await addAnimal(formData);
      toast.success("Animal adicionado com sucesso!");
      setFormData({
        nome: "",
        sexo: "Macho",
        pelagem: "",
        idade: "",
        nomeTutor: "",
        tratamentoPara: "",
        tratamento: "",
      });
      onSuccess();
    } catch (error) {
      toast.error("Erro ao adicionar animal");
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Novo Animal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                NOME *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-2">
                SEXO *
              </label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div>
              <label htmlFor="pelagem" className="block text-sm font-medium text-gray-700 mb-2">
                PELAGEM *
              </label>
              <input
                type="text"
                id="pelagem"
                name="pelagem"
                value={formData.pelagem}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-2">
                IDADE *
              </label>
              <input
                type="text"
                id="idade"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                placeholder="Ex: 2 anos, 6 meses"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="nomeTutor" className="block text-sm font-medium text-gray-700 mb-2">
                NOME DO TUTOR *
              </label>
              <input
                type="text"
                id="nomeTutor"
                name="nomeTutor"
                value={formData.nomeTutor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tratamentoPara" className="block text-sm font-medium text-gray-700 mb-2">
                TRATAMENTO PARA *
              </label>
              <textarea
                id="tratamentoPara"
                name="tratamentoPara"
                value={formData.tratamentoPara}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tratamento" className="block text-sm font-medium text-gray-700 mb-2">
                TRATAMENTO *
              </label>
              <textarea
                id="tratamento"
                name="tratamento"
                value={formData.tratamento}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Adicionar Animal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
