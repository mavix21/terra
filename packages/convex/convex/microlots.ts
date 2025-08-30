import { query } from "./_generated/server";

export const getAvailableMicrolots = query({
  handler: async (ctx) => {
    return await ctx.db.query("microlots").collect();
  },
});
