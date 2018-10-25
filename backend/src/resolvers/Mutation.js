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
        // 1. find the item
        const item = await ctx.db.query.item({ where }, `{ id title }`);
        //check if they oww that item or have permission
        //delete it
        return ctx.db.mutation.deleteItem({ where }, info);
    }
};

module.exports = Mutations;
