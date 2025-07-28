import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { toast } from 'sonner'
import { Id } from '../../convex/_generated/dataModel'
import { useState, useEffect } from 'react'

interface Medication {
  _id: Id<'medicationRecords'>
  animalId: Id<'animals'>
  data: string
  horario: string
  medicamento: string
  dose: string
  administrado: boolean
  observacoes?: string
  animal: {
    _id: Id<'animals'>
    nome: string
    sexo: 'Macho' | 'Fêmea'
    pelagem: string
    idade: string
    nomeTutor: string
    tratamentoPara: string
    tratamento: string
  } | null
}

interface TodaysMedicationsProps {
  medications: Medication[]
}

export function TodaysMedications({ medications }: TodaysMedicationsProps) {
  const getCurrentHour = () => {
    const now = new Date()
    return now.getHours()
  }

  const shouldCollapseSection = (timeString: string) => {
    const currentHour = getCurrentHour()
    const [hours] = timeString.split(':')
    const sectionHour = parseInt(hours, 10)
    return sectionHour < currentHour
  }

  const getInitialCollapsedState = () => {
    const groupedMedications = medications.reduce(
      (groups, medication) => {
        const time = medication.horario
        if (!groups[time]) {
          groups[time] = []
        }
        groups[time].push(medication)
        return groups
      },
      {} as Record<string, Medication[]>
    )

    const initialState: Record<string, boolean> = {}
    Object.keys(groupedMedications).forEach(time => {
      initialState[time] = shouldCollapseSection(time)
    })
    return initialState
  }

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setCollapsedSections(getInitialCollapsedState())
  }, [medications])
  
  const markAsAdministered = useMutation(
    api.medications.markMedicationAsAdministered
  )
  const undoAdministration = useMutation(
    api.medications.undoMedicationAdministration
  )

  const handleMarkAsAdministered = async (
    medicationId: Id<'medicationRecords'>
  ) => {
    try {
      await markAsAdministered({ id: medicationId })
      toast.success('Medicação marcada como administrada!')
    } catch (error) {
      toast.error('Erro ao marcar medicação')
      console.error(error)
    }
  }

  const handleUndoAdministration = async (
    medicationId: Id<'medicationRecords'>
  ) => {
    try {
      await undoAdministration({ id: medicationId })
      toast.success('Administração desfeita!')
    } catch (error) {
      toast.error('Erro ao desfazer administração')
      console.error(error)
    }
  }

  const toggleSection = (time: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [time]: !prev[time]
    }))
  }

  // Group medications by time
  const groupedMedications = medications.reduce(
    (groups, medication) => {
      const time = medication.horario
      if (!groups[time]) {
        groups[time] = []
      }
      groups[time].push(medication)
      return groups
    },
    {} as Record<string, Medication[]>
  )

  // Sort times chronologically
  const sortedTimes = Object.keys(groupedMedications).sort((a, b) => {
    return a.localeCompare(b)
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Medicações de Hoje
      </h2>

      {medications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500 text-lg">
            Nenhuma medicação programada para hoje.
          </p>
        </div>
      ) : (
        <div className="rounded-lg shadow-sm border">
          {sortedTimes.map((time, index) => (
            <div key={time}>
              <button
                onClick={() => toggleSection(time)}
                className="w-full bg-gray-50 px-6 py-3 border-b hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-gray-900">{time}</h3>
                <div className="flex items-center gap-3">
                  {(() => {
                    const totalMeds = groupedMedications[time].length
                    const administeredMeds = groupedMedications[time].filter(med => med.administrado).length
                    const isComplete = administeredMeds === totalMeds
                    const isPastSection = shouldCollapseSection(time)
                    
                    return (
                      <>
                        {isPastSection && (
                          <span className="text-xs font-medium text-red-600">
                            Atenção!
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isPastSection
                              ? 'bg-red-100 text-red-800'
                              : isComplete
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {administeredMeds}/{totalMeds}
                        </span>
                      </>
                    )
                  })()}
                  <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    collapsedSections[time] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                  </svg>
                </div>
              </button>

              {!collapsedSections[time] && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedMedications[time].map((medication) => (
                  <div
                    key={medication._id}
                    className={`border rounded-lg p-4 ${
                      medication.administrado
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-starjt mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {medication.animal?.nome}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {medication.animal?.sexo} •{' '}
                          {medication.animal?.pelagem}
                        </p>
                      </div>
                      <span
                        className={`px-2 items-center flex text-xs font-medium rounded-full ${
                          medication.administrado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {medication.administrado ? 'Administrada' : 'Pendente'}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-4">
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

                    {medication.administrado ? (
                      <button
                        onClick={() => handleUndoAdministration(medication._id)}
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                      >
                        Desfazer Administração
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAsAdministered(medication._id)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm"
                      >
                        Marcar como Administrada
                      </button>
                    )}
                  </div>
                ))}
              </div>
              )}
              {/* Divider between time sections (except for the last one) */}
              {index < sortedTimes.length - 1 && (
                <div className="border-b border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
