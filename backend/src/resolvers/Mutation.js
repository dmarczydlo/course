const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    },

    async signUp(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        //hash password
        password = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] },
            },
        }, info)


        //create JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
        });

        return user;
    },
    async signIn(parent, { email, password }, ctx, info) {
        //check if there is a suser with that email
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        //check that if their password is corrrect
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        //set cookie
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
        });
        return user;
    },

    signOut(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'Goodbye' }

    }
};

module.exports = Mutations;
