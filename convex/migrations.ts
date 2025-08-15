import { Migrations } from "@convex-dev/migrations"
import { components, internal } from "./_generated/api.js"
import { DataModel } from "./_generated/dataModel.js"

export const migrations = new Migrations<DataModel>(components.migrations)

export const cloneAnimalsTable = migrations.define({
  table: "animals",
  migrateOne: async (ctx, animal) => {
    await ctx.db.insert("animalsEn", {
      name: animal.nome,
      sex: animal.sexo === "Fêmea" ? "Femea" : animal.sexo, // Convert Fêmea to Femea
      coat: animal.pelagem,
      age: animal.idade,
      ownerName: animal.nomeTutor,
      treatmentFor: animal.tratamentoPara,
      treatment: animal.tratamento,
      fiv: animal.fiv,
      felv: animal.felv,
      rabies: animal.raiva,
      v6: animal.v6,
      active: animal.ativo,
      createdBy: animal.createdBy,
    })
  },
})

export const cloneMedicationsTable = migrations.define({
  table: "medicationRecords",
  migrateOne: async (ctx, record) => {
    // Get the original animal to extract the matching criteria
    const originalAnimal = await ctx.db.get(record.animalId)
    if (!originalAnimal) {
      console.warn(
        `Original animal not found for medication record: ${record._id}`
      )
      return
    }

    // Find the corresponding animal in the new English table
    const newAnimal = await ctx.db
      .query("animalsEn")
      .filter((q) =>
        q.and(
          q.eq(q.field("name"), originalAnimal.nome),
          q.eq(q.field("ownerName"), originalAnimal.nomeTutor),
          q.eq(q.field("createdBy"), originalAnimal.createdBy)
        )
      )
      .first()

    if (!newAnimal) {
      console.warn(`New animal not found for medication record: ${record._id}`)
      return
    }

    await ctx.db.insert("medicationRecordsEn", {
      animalId: newAnimal._id,
      date: record.data,
      endDate: record.endDate,
      time: record.horario,
      medication: record.medicamento,
      dose: record.dose,
      administered: record.administrado,
      observations: record.observacoes,
      administeredBy: record.administradoPor,
    })
  },
})

export const run = migrations.runner([
  internal.migrations.cloneAnimalsTable,
  internal.migrations.cloneMedicationsTable,
])
