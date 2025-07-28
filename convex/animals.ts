import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addAnimal = mutation({
  args: {
    nome: v.string(),
    sexo: v.union(v.literal("Macho"), v.literal("Fêmea")),
    pelagem: v.string(),
    idade: v.string(),
    nomeTutor: v.string(),
    tratamentoPara: v.string(),
    tratamento: v.string(),
    fiv: v.boolean(),
    felv: v.boolean(),
    raiva: v.boolean(),
    v6: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    return await ctx.db.insert("animals", {
      ...args,
      ativo: true,
      createdBy: userId,
    });
  },
});

export const listAnimals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("animals")
      .filter((q) => q.eq(q.field("ativo"), true))
      .collect();
  },
});

export const getAnimal = query({
  args: { id: v.id("animals") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const animal = await ctx.db.get(args.id);
    if (!animal || !animal.ativo) {
      return null;
    }

    return animal;
  },
});

export const updateAnimal = mutation({
  args: {
    id: v.id("animals"),
    nome: v.string(),
    sexo: v.union(v.literal("Macho"), v.literal("Fêmea")),
    pelagem: v.string(),
    idade: v.string(),
    nomeTutor: v.string(),
    tratamentoPara: v.string(),
    tratamento: v.string(),
    fiv: v.boolean(),
    felv: v.boolean(),
    raiva: v.boolean(),
    v6: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const animal = await ctx.db.get(args.id);
    if (!animal) {
      throw new Error("Animal não encontrado");
    }

    const { id, ...updateData } = args;
    await ctx.db.patch(args.id, updateData);
  },
});

export const deactivateAnimal = mutation({
  args: { id: v.id("animals") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const animal = await ctx.db.get(args.id);
    if (!animal) {
      throw new Error("Animal não encontrado");
    }

    await ctx.db.patch(args.id, { ativo: false });
  },
});
