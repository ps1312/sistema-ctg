import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { toast } from 'sonner'
import { AddMedicationForm } from './AddMedicationForm'
import { HealthStatus } from './health-status'
import TrashIcon from './trash-icon'

interface AnimalDetailsProps {
  animalId: Id<'animals'>
  onBack: () => void
}

export function AnimalDetails({ animalId, onBack }: AnimalDetailsProps) {
  const [showAddMedication, setShowAddMedication] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({
    nome: '',
    sexo: 'Macho' as 'Macho' | 'Fêmea',
    pelagem: '',
    idade: '',
    nomeTutor: '',
    tratamentoPara: '',
    tratamento: '',
    fiv: false,
    felv: false,
    raiva: false,
    v6: false,
  })

  const animal = useQuery(api.animals.getAnimal, { id: animalId })
  const medications = useQuery(api.medications.getMedicationsByAnimal, {
    animalId,
  })
  const updateAnimal = useMutation(api.animals.updateAnimal)
  const deactivateAnimal = useMutation(api.animals.deactivateAnimal)
  const deleteMedication = useMutation(api.medications.deleteMedication)

  if (!animal) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Animal não encontrado.</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Voltar
        </button>
      </div>
    )
  }

  const handleEdit = () => {
    setEditData({
      nome: animal.nome,
      sexo: animal.sexo,
      pelagem: animal.pelagem,
      idade: animal.idade,
      nomeTutor: animal.nomeTutor,
      tratamentoPara: animal.tratamentoPara,
      tratamento: animal.tratamento,
      fiv: (animal as any).fiv || false,
      felv: (animal as any).felv || false,
      raiva: (animal as any).raiva || false,
      v6: (animal as any).v6 || false,
    })
    setEditMode(true)
  }

  const handleSaveEdit = async () => {
    try {
      await updateAnimal({ id: animalId, ...editData })
      toast.success('Animal atualizado com sucesso!')
      setEditMode(false)
    } catch (error) {
      toast.error('Erro ao atualizar animal')
      console.error(error)
    }
  }

  const handleDeactivate = async () => {
    if (
      confirm(
        'Tem certeza que deseja remover este animal? Esta ação não pode ser desfeita.'
      )
    ) {
      try {
        await deactivateAnimal({ id: animalId })
        toast.success('Animal removido com sucesso!')
        onBack()
      } catch (error) {
        toast.error('Erro ao remover animal')
        console.error(error)
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleDeleteMedication = async (
    medicationId: Id<'medicationRecords'>
  ) => {
    try {
      await deleteMedication({ id: medicationId })
      toast.success('Medicação excluída com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir medicação')
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Voltar para Lista
        </button>
        <div className="flex gap-2">
          {!editMode ? (
            <>
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => setShowAddMedication(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Adicionar Medicação
              </button>
              <button
                onClick={handleDeactivate}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
              >
                Remover Animal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Animal Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Informações do Animal
          </h2>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={editData.nome}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={editData.sexo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pelagem
                </label>
                <input
                  type="text"
                  name="pelagem"
                  value={editData.pelagem}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="text"
                  name="idade"
                  value={editData.idade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Tutor
                </label>
                <input
                  type="text"
                  name="nomeTutor"
                  value={editData.nomeTutor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamento Para
                </label>
                <textarea
                  name="tratamentoPara"
                  value={editData.tratamentoPara}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamento
                </label>
                <textarea
                  name="tratamento"
                  value={editData.tratamento}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <HealthStatus
                data={{
                  fiv: editData.fiv,
                  felv: editData.felv,
                  raiva: editData.raiva,
                  v6: editData.v6,
                }}
                editMode={true}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {animal.nome}
                </h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    animal.sexo === 'Macho'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-pink-100 text-pink-800'
                  }`}
                >
                  {animal.sexo}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Pelagem:</span>
                  <p className="text-gray-600">{animal.pelagem}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Idade:</span>
                  <p className="text-gray-600">{animal.idade}</p>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-700">Tutor:</span>
                <p className="text-gray-600">{animal.nomeTutor}</p>
              </div>

              <div>
                <span className="font-medium text-gray-700">
                  Tratamento para:
                </span>
                <p className="text-gray-600 mt-1">{animal.tratamentoPara}</p>
              </div>

              <div>
                <span className="font-medium text-gray-700">Tratamento:</span>
                <p className="text-gray-600 mt-1">{animal.tratamento}</p>
              </div>

              <HealthStatus
                data={{
                  fiv: (animal as any).fiv || false,
                  felv: (animal as any).felv || false,
                  raiva: (animal as any).raiva || false,
                  v6: (animal as any).v6 || false,
                }}
                editMode={false}
              />
            </div>
          )}
        </div>

        {/* Medications History */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Histórico de Medicações
            </h2>
            <span className="text-sm text-gray-600">
              {medications?.length || 0} registros
            </span>
          </div>

          {!medications || medications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma medicação registrada ainda.
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {medications.map((medication) => (
                <div key={medication._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-600">
                      {medication.data} às {medication.horario}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          medication.administrado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {medication.administrado ? 'Administrada' : 'Pendente'}
                      </span>
                      <button
                        onClick={() => handleDeleteMedication(medication._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <TrashIcon size={20} color="red" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Medicamento:</span>{' '}
                      {medication.medicamento}
                    </p>
                    <p>
                      <span className="font-medium">Dose:</span>{' '}
                      {medication.dose}
                    </p>
                    {medication.observacoes && (
                      <p>
                        <span className="font-medium">Observações:</span>{' '}
                        {medication.observacoes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Adicionar Medicação</h3>
                <button
                  onClick={() => setShowAddMedication(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <AddMedicationForm
                animalId={animalId}
                animalName={animal.nome}
                onSuccess={() => setShowAddMedication(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
