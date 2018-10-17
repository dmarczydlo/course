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

    updateItem(parent, args, ctx, info) {
        const update = { ...args };
        delete update.id;
        return ctx.db.mutation.updateItem({
            data: update,
            where: {
                id: args.id
            }
        }, info);
    },

    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        //find item
        const item = await ctx.db.query.item({
            where
        });
        //check that is own of item
        //delete id
    }
};

module.exports = Mutations;
