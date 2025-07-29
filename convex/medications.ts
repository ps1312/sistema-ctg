import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

export const addMedicationRecord = mutation({
  args: {
    animalId: v.id('animals'),
    data: v.string(),
    endDate: v.optional(v.string()),
    horario: v.string(),
    medicamento: v.string(),
    dose: v.string(),
    observacoes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    // Verify the animal exists and is active
    const animal = await ctx.db.get(args.animalId)
    if (!animal || !animal.ativo) {
      throw new Error('Animal não encontrado')
    }

    return await ctx.db.insert('medicationRecords', {
      ...args,
      administrado: false,
    })
  },
})

export const getMedicationsByAnimal = query({
  args: { animalId: v.id('animals') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    // Verify the animal exists and is active
    const animal = await ctx.db.get(args.animalId)
    if (!animal || !animal.ativo) {
      return []
    }

    return await ctx.db
      .query('medicationRecords')
      .withIndex('by_animal_and_date', (q) => q.eq('animalId', args.animalId))
      .order('desc')
      .collect()
  },
})

export const getTodaysMedications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const today = new Date().toISOString().split('T')[0]

    const medications = await ctx.db
      .query('medicationRecords')
      .withIndex('by_date', (q) => q.eq('data', today))
      .collect()

    // Get all active animals
    const allAnimals = await ctx.db
      .query('animals')
      .filter((q) => q.eq(q.field('ativo'), true))
      .collect()

    const animalMap = new Map(allAnimals.map((animal) => [animal._id, animal]))

    // Filter medications for active animals only
    const activeMedications = medications.filter((med) =>
      animalMap.has(med.animalId)
    )

    // Get animal details for each medication
    const medicationsWithAnimals = activeMedications.map((med) => ({
      ...med,
      animal: animalMap.get(med.animalId) || null,
    }))

    return medicationsWithAnimals.sort((a, b) =>
      a.horario.localeCompare(b.horario)
    )
  },
})

export const markMedicationAsAdministered = mutation({
  args: {
    id: v.id('medicationRecords'),
    observacoes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const medication = await ctx.db.get(args.id)
    if (!medication) {
      throw new Error('Medicação não encontrada')
    }

    // Verify the animal exists and is active
    const animal = await ctx.db.get(medication.animalId)
    if (!animal || !animal.ativo) {
      throw new Error('Animal não encontrado')
    }

    await ctx.db.patch(args.id, {
      administrado: true,
      administradoPor: userId,
      observacoes: args.observacoes,
    })
  },
})

export const undoMedicationAdministration = mutation({
  args: { id: v.id('medicationRecords') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const medication = await ctx.db.get(args.id)
    if (!medication) {
      throw new Error('Medicação não encontrada')
    }

    const animal = await ctx.db.get(medication.animalId)
    if (!animal || !animal.ativo) {
      throw new Error('Animal não encontrado')
    }

    await ctx.db.patch(args.id, {
      administrado: false,
      administradoPor: undefined,
      observacoes: undefined,
    })
  },
})

export const deleteMedication = mutation({
  args: { id: v.id('medicationRecords') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const medication = await ctx.db.get(args.id)
    if (!medication) {
      throw new Error('Medicação não encontrada')
    }

    const animal = await ctx.db.get(medication.animalId)
    if (!animal || !animal.ativo) {
      throw new Error('Animal não encontrado')
    }

    await ctx.db.delete(args.id)
  },
})
