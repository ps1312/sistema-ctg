interface HealthStatusProps {
  data: {
    fiv: boolean
    felv: boolean
    raiva: boolean
    v6: boolean
  }
  editMode?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function HealthStatus({ data, editMode = false, onChange }: HealthStatusProps) {
  if (editMode) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fiv"
              name="fiv"
              checked={data.fiv}
              onChange={onChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="fiv" className="text-sm font-medium text-gray-700">
              FIV
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="felv"
              name="felv"
              checked={data.felv}
              onChange={onChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="felv" className="text-sm font-medium text-gray-700">
              FELV
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vacinado
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="raiva"
                name="raiva"
                checked={data.raiva}
                onChange={onChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="raiva" className="text-sm font-medium text-gray-700">
                Raiva
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="v6"
                name="v6"
                checked={data.v6}
                onChange={onChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="v6" className="text-sm font-medium text-gray-700">
                V6
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">FIV:</span>
          <p className={`text-sm font-medium ${
            data.fiv 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            {data.fiv ? 'Positivo' : 'Negativo'}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-700">FELV:</span>
          <p className={`text-sm font-medium ${
            data.felv 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            {data.felv ? 'Positivo' : 'Negativo'}
          </p>
        </div>
      </div>
      
      <div>
        <span className="font-medium text-gray-700 block mb-2">Vacinado:</span>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Raiva:</span>
            <p className={`text-sm font-medium ${
              data.raiva 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {data.raiva ? 'Sim' : 'Não'}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">V6:</span>
            <p className={`text-sm font-medium ${
              data.v6 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {data.v6 ? 'Sim' : 'Não'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
