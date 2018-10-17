const Mutations = {
    async createItem(parent, args, ctx, info) {
        //TODO check if they are logged in
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },

    async updateItem(parent, args, ctx, info) {
        const update = { ...args };
        delete update.id;
        const item = await ctx.db.mutation.updateItem({
            data: update,
            where: {
                id: args.id
            }
        }, info);

        return item;
    }
};

module.exports = Mutations;
