import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addAnimal = mutation({
  args: {
    name: v.string(),
    sex: v.union(v.literal("Macho"), v.literal("Femea")),
    coat: v.string(),
    age: v.string(),
    ownerName: v.string(),
    treatmentFor: v.string(),
    treatment: v.string(),
    fiv: v.boolean(),
    felv: v.boolean(),
    rabies: v.boolean(),
    v6: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    return await ctx.db.insert("animalsEn", {
      ...args,
      active: true,
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
      .query("animalsEn")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const getAnimal = query({
  args: { id: v.id("animalsEn") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const animal = await ctx.db.get(args.id);
    if (!animal || !animal.active) {
      return null;
    }

    return animal;
  },
});

export const updateAnimal = mutation({
  args: {
    id: v.id("animalsEn"),
    name: v.string(),
    sex: v.union(v.literal("Macho"), v.literal("Femea")),
    coat: v.string(),
    age: v.string(),
    ownerName: v.string(),
    treatmentFor: v.string(),
    treatment: v.string(),
    fiv: v.boolean(),
    felv: v.boolean(),
    rabies: v.boolean(),
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
  args: { id: v.id("animalsEn") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const animal = await ctx.db.get(args.id);
    if (!animal) {
      throw new Error("Animal não encontrado");
    }

    await ctx.db.patch(args.id, { active: false });
  },
});
