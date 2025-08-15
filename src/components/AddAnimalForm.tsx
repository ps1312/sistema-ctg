import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { toast } from 'sonner'
import { HealthStatus } from './health-status'

interface AddAnimalFormProps {
  onSuccess: () => void
}

export function AddAnimalForm({ onSuccess }: AddAnimalFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    sex: 'Macho' as 'Macho' | 'Femea',
    coat: '',
    age: '',
    ownerName: '',
    treatmentFor: '',
    treatment: '',
    fiv: false,
    felv: false,
    rabies: false,
    v6: false,
  })

  const addAnimal = useMutation(api.animals.addAnimal)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.coat.trim() ||
      !formData.age.trim() ||
      !formData.ownerName.trim() ||
      !formData.treatmentFor.trim() ||
      !formData.treatment.trim()
    ) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      await addAnimal(formData)
      toast.success('Animal adicionado com sucesso!')
      setFormData({
        name: '',
        sex: 'Macho',
        coat: '',
        age: '',
        ownerName: '',
        treatmentFor: '',
        treatment: '',
        fiv: false,
        felv: false,
        rabies: false,
        v6: false,
      })
      onSuccess()
    } catch (error) {
      toast.error('Erro ao adicionar animal')
      console.error(error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Adicionar Novo Animal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NOME *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="sex"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                SEXO *
              </label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Macho">Macho</option>
                <option value="Femea">Fêmea</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="coat"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                PELAGEM *
              </label>
              <input
                type="text"
                id="coat"
                name="coat"
                value={formData.coat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                IDADE *
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Ex: 2 anos, 6 meses"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="ownerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NOME DO TUTOR *
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="treatmentFor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                TRATAMENTO PARA *
              </label>
              <textarea
                id="treatmentFor"
                name="treatmentFor"
                value={formData.treatmentFor}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="treatment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                TRATAMENTO *
              </label>
              <textarea
                id="treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status de Saúde</h3>
              <HealthStatus
                data={{
                  fiv: formData.fiv,
                  felv: formData.felv,
                  rabies: formData.rabies,
                  v6: formData.v6
                }}
                editMode={true}
                onChange={handleChange}
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
  )
}
