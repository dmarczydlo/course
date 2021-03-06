const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to do that');
        }

        const item = await ctx.db.mutation.createItem({
            data: {
                user: {
                    //connection between user and item
                    connect: {
                        id: ctx.request.userId
                    }
                },
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

    },
    async requestReset(parent, args, ctx, info) {
        //check if this is a real user
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
            throw new Error(`No such user found for email ${args.email}`);
        }
        //set a reset token and exourt on that user
        const resetToken = (await promisify(randomBytes)(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry }
        });


        //email them that reset token
        const mailRes = await transport.sendMail({
            from: 'test@o2.pl',
            to: user.email,
            subject: 'Your password reset password',
            html: makeANiceEmail(`Your password reset Token is here \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}"/>Click here to reset</a>`)
        });

        return { message: 'Thanks' };

    },

    async resetPassword(parent, args, ctx, info) {
        //check if the passwords match
        if (args.password !== args.confirmPassword) {
            throw new Error('Yor passwords don\'t match');
        }
        //check if its a legit reset token
        //check if its expired
        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        });

        if (!user) {
            throw new Error('This token is either invalid or expired!');
        }
        //hash their new password
        const password = await bcrypt.hash(args.password, 10);
        //save the new password to the user and remove old resetToken
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {
                email: user.email
            },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
        //generate JWT
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        //set the JWT cookie
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        });
        //return the new user
        return updatedUser;
    }
};

module.exports = Mutations;
