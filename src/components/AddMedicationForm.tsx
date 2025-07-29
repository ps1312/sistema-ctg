import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { toast } from 'sonner'

interface AddMedicationFormProps {
  animalId: Id<'animals'>
  animalName: string
  onSuccess: () => void
}

function defaultFormValues() {
  return {
    data: new Date().toISOString().split('T')[0],
    endDate: '',
    horario: '',
    medicamento: '',
    dose: '',
    secondDoseTime: '',
    observacoes: '',
  }
}

export function AddMedicationForm({
  animalId,
  animalName,
  onSuccess,
}: AddMedicationFormProps) {
  const [formData, setFormData] = useState(defaultFormValues())
  const addMedicationRecord = useMutation(api.medications.addMedicationRecord)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.horario.trim() ||
      !formData.medicamento.trim() ||
      !formData.dose.trim()
    ) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      const medicationRecord = {
        animalId,
        data: formData.data,
        endDate: formData.endDate,
        horario: formData.horario,
        medicamento: formData.medicamento,
        dose: formData.dose,
        observacoes: formData.observacoes || undefined,
      }

      await addMedicationRecord(medicationRecord)

      if (formData.secondDoseTime) {
        medicationRecord.horario = formData.secondDoseTime
        await addMedicationRecord(medicationRecord)
      }

      toast.success('Medicação adicionada com sucesso!')
      setFormData(defaultFormValues())
      onSuccess()
    } catch (error) {
      toast.error('Erro ao adicionar medicação')
      console.error(error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Adicionando medicação para:{' '}
          <span className="font-semibold">{animalName}</span>
        </p>
      </div>

      <div>
        <label
          htmlFor="data"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Início da medicação *
        </label>
        <input
          type="date"
          id="data"
          name="data"
          value={formData.data}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Fim da medicação
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="horario"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Horário da primeira dose *
          </label>
          <input
            type="time"
            id="horario"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="secondDoseTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Horário da segunda dose
          </label>
          <input
            type="time"
            id="secondDoseTime"
            name="secondDoseTime"
            value={formData.secondDoseTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="medicamento"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Medicamento *
        </label>
        <input
          type="text"
          id="medicamento"
          name="medicamento"
          value={formData.medicamento}
          onChange={handleChange}
          placeholder="Nome do medicamento"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="dose"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Dose *
        </label>
        <input
          type="text"
          id="dose"
          name="dose"
          value={formData.dose}
          onChange={handleChange}
          placeholder="Ex: 1 comprimido, 5ml, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="observacoes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          rows={3}
          placeholder="Observações adicionais (opcional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Adicionar Medicação
        </button>
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
