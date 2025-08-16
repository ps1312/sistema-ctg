import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'

export const addMedicationRecord = mutation({
  args: {
    animalId: v.id('animalsEn'),
    date: v.string(),
    time: v.string(),
    medication: v.string(),
    dose: v.string(),
    observations: v.optional(v.string()),
    groupId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const animal = await ctx.db.get(args.animalId)
    if (!animal || !animal.active) {
      throw new Error('Animal não encontrado')
    }

    return await ctx.db.insert('medicationRecordsEn', {
      ...args,
      administered: false,
    })
  },
})

export const addMultipleMedicationRecords = mutation({
  args: {
    animalId: v.id('animalsEn'),
    date: v.string(),
    endDate: v.string(),
    time: v.string(),
    medication: v.string(),
    dose: v.string(),
    observations: v.optional(v.string()),
    groupId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const animal = await ctx.db.get(args.animalId)
    if (!animal || !animal.active) {
      throw new Error('Animal não encontrado')
    }

    const startDate = new Date(args.date)
    const endDate = new Date(args.endDate)

    const currentDate = startDate
    while (currentDate <= endDate) {
      await ctx.db.insert('medicationRecordsEn', {
        ...args,
        date: currentDate.toISOString().split('T')[0],
        administered: false,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return true
  },
})

export const getMedicationsByAnimal = query({
  args: { animalId: v.id('animalsEn') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const animal = await ctx.db.get(args.animalId)
    if (!animal || !animal.active) {
      return []
    }

    return await ctx.db
      .query('medicationRecordsEn')
      .withIndex('by_animal_and_date', (q) => q.eq('animalId', args.animalId))
      .order('desc')
      .collect()
  },
})

export const getMedicationsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const medications = await ctx.db
      .query('medicationRecordsEn')
      .withIndex('by_date', (q) => q.eq('date', args.date))
      .collect()

    // Get all active animals
    const allAnimals = await ctx.db
      .query('animalsEn')
      .filter((q) => q.eq(q.field('active'), true))
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
      a.time.localeCompare(b.time)
    )
  },
})

export const markMedicationAsAdministered = mutation({
  args: {
    id: v.id('medicationRecordsEn'),
    observations: v.optional(v.string()),
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
    if (!animal || !animal.active) {
      throw new Error('Animal não encontrado')
    }

    await ctx.db.patch(args.id, {
      administered: true,
      administeredBy: userId,
      observations: args.observations,
    })
  },
})

export const undoMedicationAdministration = mutation({
  args: { id: v.id('medicationRecordsEn') },
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
    if (!animal || !animal.active) {
      throw new Error('Animal não encontrado')
    }

    await ctx.db.patch(args.id, {
      administered: false,
      administeredBy: undefined,
      observations: undefined,
    })
  },
})

export const deleteMedication = mutation({
  args: { id: v.id('medicationRecordsEn') },
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
    if (!animal || !animal.active) {
      throw new Error('Animal não encontrado')
    }

    await ctx.db.delete(args.id)
  },
})

export const getMedicationsByGroup = query({
  args: { groupId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const medications = await ctx.db
      .query('medicationRecordsEn')
      .withIndex('by_group', (q) => q.eq('groupId', args.groupId))
      .collect()

    // Get all active animals
    const allAnimals = await ctx.db
      .query('animalsEn')
      .filter((q) => q.eq(q.field('active'), true))
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

    return medicationsWithAnimals.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })
  },
})

export const batchUpdateMedications = mutation({
  args: {
    medicationIds: v.array(v.id('medicationRecordsEn')),
    updates: v.object({
      medication: v.optional(v.string()),
      dose: v.optional(v.string()),
      time: v.optional(v.string()),
      observations: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    // Verify all medications exist and user has access
    for (const id of args.medicationIds) {
      const medication = await ctx.db.get(id)
      if (!medication) {
        throw new Error('Uma ou mais medicações não foram encontradas')
      }

      const animal = await ctx.db.get(medication.animalId)
      if (!animal || !animal.active) {
        throw new Error('Animal não encontrado para uma das medicações')
      }
    }

    // Perform batch update
    const updatePromises = args.medicationIds.map((id) =>
      ctx.db.patch(id, args.updates)
    )

    await Promise.all(updatePromises)
    return { updated: args.medicationIds.length }
  },
})

export const batchDeleteMedications = mutation({
  args: {
    medicationIds: v.array(v.id('medicationRecordsEn')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    // Verify all medications exist and user has access
    for (const id of args.medicationIds) {
      const medication = await ctx.db.get(id)
      if (!medication) {
        throw new Error('Uma ou mais medicações não foram encontradas')
      }

      const animal = await ctx.db.get(medication.animalId)
      if (!animal || !animal.active) {
        throw new Error('Animal não encontrado para uma das medicações')
      }
    }

    // Perform batch delete
    const deletePromises = args.medicationIds.map((id) => ctx.db.delete(id))

    await Promise.all(deletePromises)
    return { deleted: args.medicationIds.length }
  },
})

export const batchDeleteByGroup = mutation({
  args: { groupId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    const medications = await ctx.db
      .query('medicationRecordsEn')
      .withIndex('by_group', (q) => q.eq('groupId', args.groupId))
      .collect()

    // Verify access to all medications in the group
    for (const medication of medications) {
      const animal = await ctx.db.get(medication.animalId)
      if (!animal || !animal.active) {
        throw new Error('Acesso negado para uma das medicações no grupo')
      }
    }

    // Delete all medications in the group
    const deletePromises = medications.map((med) => ctx.db.delete(med._id))
    await Promise.all(deletePromises)

    return { deleted: medications.length }
  },
})

export const batchMarkAsAdministered = mutation({
  args: {
    medicationIds: v.array(v.id('medicationRecordsEn')),
    observations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Usuário não autenticado')
    }

    // Verify all medications exist and user has access
    for (const id of args.medicationIds) {
      const medication = await ctx.db.get(id)
      if (!medication) {
        throw new Error('Uma ou mais medicações não foram encontradas')
      }

      const animal = await ctx.db.get(medication.animalId)
      if (!animal || !animal.active) {
        throw new Error('Animal não encontrado para uma das medicações')
      }
    }

    // Perform batch update
    const updatePromises = args.medicationIds.map((id) =>
      ctx.db.patch(id, {
        administered: true,
        administeredBy: userId,
        observations: args.observations,
      })
    )

    await Promise.all(updatePromises)
    return { updated: args.medicationIds.length }
  },
})
