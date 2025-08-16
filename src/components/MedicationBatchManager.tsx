import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { toast } from 'sonner'
import TrashIcon from './trash-icon'

interface Medication {
  _id: Id<'medicationRecordsEn'>
  date: string
  time: string
  medication: string
  dose: string
  administered: boolean
  observations?: string
  groupId?: string
  animal?: {
    _id: Id<'animalsEn'>
    name: string
  }
}

interface MedicationBatchManagerProps {
  medications: Medication[]
  showAnimalName?: boolean
  onMedicationUpdate?: () => void
}

export function MedicationBatchManager({ 
  medications, 
  showAnimalName = false,
  onMedicationUpdate 
}: MedicationBatchManagerProps) {
  const [selectedMedications, setSelectedMedications] = useState<Set<Id<'medicationRecordsEn'>>>(new Set())
  const [batchMode, setBatchMode] = useState(false)
  const [editingBatch, setEditingBatch] = useState(false)
  const [batchEditData, setBatchEditData] = useState({
    medication: '',
    dose: '',
    time: '',
    observations: '',
  })

  const batchUpdateMedications = useMutation(api.medications.batchUpdateMedications)
  const batchDeleteMedications = useMutation(api.medications.batchDeleteMedications)
  const batchMarkAsAdministered = useMutation(api.medications.batchMarkAsAdministered)
  const batchDeleteByGroup = useMutation(api.medications.batchDeleteByGroup)
  const deleteMedication = useMutation(api.medications.deleteMedication)

  // Group medications by groupId
  const groupedMedications = medications.reduce((groups, med) => {
    const key = med.groupId || `individual-${med._id}`
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(med)
    return groups
  }, {} as Record<string, Medication[]>)

  const handleSelectMedication = (medicationId: Id<'medicationRecordsEn'>) => {
    const newSelected = new Set(selectedMedications)
    if (newSelected.has(medicationId)) {
      newSelected.delete(medicationId)
    } else {
      newSelected.add(medicationId)
    }
    setSelectedMedications(newSelected)
  }

  const handleSelectGroup = (group: Medication[]) => {
    const newSelected = new Set(selectedMedications)
    const groupIds = group.map(m => m._id)
    const allSelected = groupIds.every(id => newSelected.has(id))
    
    if (allSelected) {
      groupIds.forEach(id => newSelected.delete(id))
    } else {
      groupIds.forEach(id => newSelected.add(id))
    }
    setSelectedMedications(newSelected)
  }

  const handleBatchUpdate = async () => {
    if (selectedMedications.size === 0) {
      toast.error('Selecione medicações para atualizar')
      return
    }

    const updates = Object.fromEntries(
      Object.entries(batchEditData).filter(([_, value]) => value.trim() !== '')
    )

    if (Object.keys(updates).length === 0) {
      toast.error('Preencha pelo menos um campo para atualizar')
      return
    }

    try {
      await batchUpdateMedications({
        medicationIds: Array.from(selectedMedications),
        updates
      })
      toast.success(`${selectedMedications.size} medicações atualizadas`)
      setSelectedMedications(new Set())
      setBatchEditData({ medication: '', dose: '', time: '', observations: '' })
      setEditingBatch(false)
      onMedicationUpdate?.()
    } catch (error) {
      toast.error('Erro ao atualizar medicações')
      console.error(error)
    }
  }

  const handleBatchDelete = async () => {
    if (selectedMedications.size === 0) {
      toast.error('Selecione medicações para deletar')
      return
    }

    if (!confirm(`Deseja deletar ${selectedMedications.size} medicações selecionadas?`)) {
      return
    }

    try {
      await batchDeleteMedications({
        medicationIds: Array.from(selectedMedications)
      })
      toast.success(`${selectedMedications.size} medicações deletadas`)
      setSelectedMedications(new Set())
      onMedicationUpdate?.()
    } catch (error) {
      toast.error('Erro ao deletar medicações')
      console.error(error)
    }
  }

  const handleBatchMarkAdministered = async () => {
    if (selectedMedications.size === 0) {
      toast.error('Selecione medicações para marcar como administradas')
      return
    }

    try {
      await batchMarkAsAdministered({
        medicationIds: Array.from(selectedMedications),
        observations: batchEditData.observations || undefined
      })
      toast.success(`${selectedMedications.size} medicações marcadas como administradas`)
      setSelectedMedications(new Set())
      onMedicationUpdate?.()
    } catch (error) {
      toast.error('Erro ao marcar medicações como administradas')
      console.error(error)
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm(`Deseja deletar todo o grupo de medicações?`)) {
      return
    }

    try {
      await batchDeleteByGroup({ groupId })
      toast.success('Grupo de medicações deletado')
      onMedicationUpdate?.()
    } catch (error) {
      toast.error('Erro ao deletar grupo')
      console.error(error)
    }
  }

  const handleDeleteSingle = async (medicationId: Id<'medicationRecordsEn'>) => {
    try {
      await deleteMedication({ id: medicationId })
      toast.success('Medicação deletada')
      onMedicationUpdate?.()
    } catch (error) {
      toast.error('Erro ao deletar medicação')
      console.error(error)
    }
  }

  if (medications.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        Nenhuma medicação registrada ainda.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Batch controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setBatchMode(!batchMode)
              if (batchMode) {
                setSelectedMedications(new Set())
                setEditingBatch(false)
              }
            }}
            className={`px-3 py-1 text-sm rounded ${
              batchMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {batchMode ? 'Sair do modo lote' : 'Modo lote'}
          </button>
          {selectedMedications.size > 0 && (
            <span className="text-sm text-gray-600 flex items-center">
              {selectedMedications.size} selecionadas
            </span>
          )}
        </div>
        
        {batchMode && selectedMedications.size > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditingBatch(!editingBatch)}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
            >
              Editar
            </button>
            <button
              onClick={handleBatchMarkAdministered}
              className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
            >
              Marcar administradas
            </button>
            <button
              onClick={handleBatchDelete}
              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Deletar
            </button>
          </div>
        )}
      </div>

      {/* Batch edit form */}
      {editingBatch && (
        <div className="border rounded-lg p-4 bg-yellow-50">
          <h4 className="font-semibold mb-3">Editar medicações selecionadas</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Medicamento"
              value={batchEditData.medication}
              onChange={(e) => setBatchEditData(prev => ({ ...prev, medication: e.target.value }))}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Dose"
              value={batchEditData.dose}
              onChange={(e) => setBatchEditData(prev => ({ ...prev, dose: e.target.value }))}
              className="px-3 py-2 border rounded"
            />
            <input
              type="time"
              placeholder="Horário"
              value={batchEditData.time}
              onChange={(e) => setBatchEditData(prev => ({ ...prev, time: e.target.value }))}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Observações"
              value={batchEditData.observations}
              onChange={(e) => setBatchEditData(prev => ({ ...prev, observations: e.target.value }))}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBatchUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Aplicar alterações
            </button>
            <button
              onClick={() => setEditingBatch(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Medication groups */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto">
        {Object.entries(groupedMedications).map(([groupKey, group]) => {
          const isGroup = group.length > 1 && group[0].groupId
          const allGroupSelected = group.every(m => selectedMedications.has(m._id))
          
          return (
            <div key={groupKey} className={`border rounded-lg ${isGroup ? 'border-blue-200' : ''}`}>
              {isGroup && (
                <div className="bg-blue-50 px-4 py-2 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {batchMode && (
                      <input
                        type="checkbox"
                        checked={allGroupSelected}
                        onChange={() => handleSelectGroup(group)}
                        className="rounded"
                      />
                    )}
                    <span className="font-medium text-blue-800">
                      Grupo de {group.length} medicações
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(group[0].groupId!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon size={16} color="red" />
                  </button>
                </div>
              )}
              
              <div className={isGroup ? 'p-2 space-y-2' : 'p-4'}>
                {group.map((medication) => (
                  <div 
                    key={medication._id} 
                    className={`${isGroup ? 'border rounded p-3 bg-white' : ''} ${
                      batchMode && selectedMedications.has(medication._id) ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {batchMode && (
                          <input
                            type="checkbox"
                            checked={selectedMedications.has(medication._id)}
                            onChange={() => handleSelectMedication(medication._id)}
                            className="rounded"
                          />
                        )}
                        <div className="text-sm text-gray-600">
                          {medication.date} às {medication.time}
                          {showAnimalName && medication.animal && (
                            <span className="ml-2 font-medium">
                              - {medication.animal.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            medication.administered
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {medication.administered ? 'Administrada' : 'Pendente'}
                        </span>
                        {!isGroup && (
                          <button
                            onClick={() => handleDeleteSingle(medication._id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <TrashIcon size={20} color="red" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Medicamento:</span>{' '}
                        {medication.medication}
                      </p>
                      <p>
                        <span className="font-medium">Dose:</span>{' '}
                        {medication.dose}
                      </p>
                      {medication.observations && (
                        <p>
                          <span className="font-medium">Observações:</span>{' '}
                          {medication.observations}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}