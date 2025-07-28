import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

const applicationTables = {
  animals: defineTable({
    nome: v.string(),
    sexo: v.union(v.literal('Macho'), v.literal('Fêmea')),
    pelagem: v.string(),
    idade: v.string(),
    nomeTutor: v.string(),
    tratamentoPara: v.string(),
    tratamento: v.string(),
    fiv: v.optional(v.boolean()),
    felv: v.optional(v.boolean()),
    raiva: v.optional(v.boolean()),
    v6: v.optional(v.boolean()),
    ativo: v.boolean(),
    createdBy: v.id('users'),
  }).index('by_created_by', ['createdBy']),

  medicationRecords: defineTable({
    animalId: v.id('animals'),
    data: v.string(),
    horario: v.string(),
    medicamento: v.string(),
    dose: v.string(),
    administrado: v.boolean(),
    observacoes: v.optional(v.string()),
    administradoPor: v.optional(v.id('users')),
  })
    .index('by_animal_and_date', ['animalId', 'data'])
    .index('by_date', ['data']),
}

export default defineSchema({
  ...authTables,
  ...applicationTables,
})
