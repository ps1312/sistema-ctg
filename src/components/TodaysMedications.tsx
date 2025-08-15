import { useMutation } from 'convex/react'

import { api } from '../../convex/_generated/api'
import { toast } from 'sonner'
import { Id } from '../../convex/_generated/dataModel'
import { useState, useEffect } from 'react'

interface Medication {
  _id: Id<'medicationRecordsEn'>
  animalId: Id<'animalsEn'>
  date: string
  time: string
  medication: string
  dose: string
  administered: boolean
  observations?: string
  endDate?: string
  animal: {
    _id: Id<'animalsEn'>
    name: string
    sex: 'Macho' | 'Femea'
    coat: string
    age: string
    ownerName: string
    treatmentFor: string
    treatment: string
  } | null
}

interface TodaysMedicationsProps {
  medications: Medication[];
  selectedDate: Date;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formatDate: (date: Date) => string;
  isLoading: boolean;
}

export function TodaysMedications({
  medications,
  selectedDate,
  handleDateChange,
  formatDate,
  isLoading,
}: TodaysMedicationsProps) {
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
      (groups: Record<string, Medication[]>, medication: Medication) => {
        const time = medication.time
        if (!groups[time]) {
          groups[time] = []
        }
        groups[time].push(medication)
        return groups
      },
      {} as Record<string, Medication[]>
    )

    const initialState: Record<string, boolean> = {}
    Object.keys(groupedMedications).forEach((time) => {
      initialState[time] = shouldCollapseSection(time)
    })
    return initialState
  }

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    setCollapsedSections(getInitialCollapsedState())
  }, [medications.length])

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
    setCollapsedSections((prev) => ({
      ...prev,
      [time]: !prev[time],
    }))
  }

  // Group medications by time
  const groupedMedications = medications.reduce(
    (groups: Record<string, Medication[]>, medication: Medication) => {
      const time = medication.time
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

  const lastDoseMedicationIds = (() => {
    const lastDayMeds = medications.filter(
      (m: Medication) => m.endDate && m.date === m.endDate
    )
    if (lastDayMeds.length === 0) return []

    const groupedByAnimal = lastDayMeds.reduce(
      (acc: Record<string, Medication[]>, med: Medication) => {
        const key = med.animalId
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(med)
        return acc
      },
      {} as Record<string, Medication[]>
    )

    const lastDoseIds: Id<'medicationRecords'>[] = []
    for (const animalId in groupedByAnimal) {
      const animalMeds = groupedByAnimal[animalId]
      const latestMed = animalMeds.reduce(
        (latest: Medication, med: Medication) => {
          return med.time > latest.time ? med : latest
        }
      )
      lastDoseIds.push(latestMed._id)
    }

    return lastDoseIds
  })()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Medicações para {selectedDate.toLocaleDateString('pt-BR')}
        </h2>
        <div className="relative">
          <input
            type="date"
            value={formatDate(selectedDate)}
            onChange={handleDateChange}
            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500 text-lg">Carregando...</p>
        </div>
      ) : medications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500 text-lg">
            Nenhuma medicação programada para esta data.
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
                    const administeredMeds = groupedMedications[time].filter(
                      (med: Medication) => med.administered
                    ).length
                    const isComplete = administeredMeds === totalMeds

                    const isPastSection = shouldCollapseSection(time)

                    return (
                      <>
                        {isPastSection && !isComplete && (
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
                  {groupedMedications[time].map((medication: Medication) => (
                    <div
                      key={medication._id}
                      className={`border rounded-lg p-4 ${
                        medication.administered
                          ? 'border-green-200 bg-green-50'
                          : lastDoseMedicationIds.includes(medication._id)
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {medication.animal?.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {medication.animal?.sex} •{' '}
                            {medication.animal?.coat}
                          </p>
                        </div>
                        <span
                          className={`px-2 items-center flex text-xs font-medium rounded-full ${
                            medication.administered
                              ? 'bg-green-100 text-green-800'
                              : lastDoseMedicationIds.includes(medication._id)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {medication.administered
                            ? 'Administrada'
                            : 'Pendente'}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
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
                        {lastDoseMedicationIds.includes(medication._id) && (
                          <p className="text-blue-600 font-semibold mt-2">
                            Última dose do tratamento.
                          </p>
                        )}
                      </div>

                      {medication.administered ? (
                        <button
                          onClick={() =>
                            handleUndoAdministration(medication._id)
                          }
                          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                        >
                          Desfazer Administração
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleMarkAsAdministered(medication._id)
                          }
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
