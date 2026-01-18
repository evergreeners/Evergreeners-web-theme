import fastify from 'fastify';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
import { auth } from './auth.js';
import { toNodeHandler } from 'better-auth/node';
import oauthPlugin from '@fastify/oauth2';
import { Octokit } from 'octokit';
import { db } from './db/index.js';
import * as schema from './db/schema.js';
import { eq, and } from 'drizzle-orm';

dotenv.config();

const server = fastify({
    logger: true,
    trustProxy: true
});


const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8080",
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [])
];

server.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
});

// Register GitHub OAuth
server.register(oauthPlugin, {
    name: 'github',
    credentials: {
        client: {
            id: process.env.GITHUB_CLIENT_ID || '',
            secret: process.env.GITHUB_CLIENT_SECRET || ''
        },
        auth: oauthPlugin.GITHUB_CONFIGURATION
    },
    startRedirectPath: '/api/auth/github/authorize',
    callbackUri: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/api/auth/github/callback`,
    scope: ['read:user', 'user:email']
});

// Auth Routes
server.register(async (instance) => {
    // Prevent Fastify from parsing the body so better-auth can handle the raw stream
    instance.removeContentTypeParser('application/json');
    instance.addContentTypeParser('application/json', (req, payload, done) => {
        done(null);
    });

    instance.all('/api/auth/*', async (req, reply) => {
        const origin = req.headers.origin;
        // Check if allow origin logic needs to be repeated or if cors plugin handles it sufficient for preflights
        // better-auth needs CORS headers on its responses too

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:8080",
            ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [])
        ];

        if (origin && allowedOrigins.includes(origin)) {
            reply.raw.setHeader("Access-Control-Allow-Origin", origin);
            reply.raw.setHeader("Access-Control-Allow-Credentials", "true");
        }

        reply.raw.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        reply.raw.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");

        return toNodeHandler(auth)(req.raw, reply.raw);
    });

    // GitHub Callback
    instance.get('/api/auth/github/callback', async (request, reply) => {
        try {
            const { token } = await instance.github.getAccessTokenFromAuthorizationCodeFlow(request);

            const octokit = new Octokit({ auth: token.access_token });
            const { data: githubUser } = await octokit.rest.users.getAuthenticated();

            // Get user emails to find primary email
            const { data: emails } = await octokit.rest.users.listEmailsForAuthenticatedUser();
            const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email;

            if (!primaryEmail) {
                reply.redirect('https://evergreeners.vercel.app/login?error=github_no_email');
                return;
            }

            // Get current session
            const session = await auth.api.getSession({
                headers: request.headers
            });

            // Restore state to find redirect target
            const state = (request.query as any).state;
            let targetPath = '/dashboard';
            if (state) {
                try {
                    const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
                    if (decoded.path) targetPath = decoded.path;
                    if (decoded.scroll) targetPath += `${targetPath.includes('?') ? '&' : '?'}scroll=${decoded.scroll}`;
                } catch (e) {
                    // ignore
                }
            }

            // SCENARIO 1: User is already logged in (Connect from Settings)
            if (session) {
                const existingAccount = await db.query.accounts.findFirst({
                    where: and(
                        eq(schema.accounts.providerId, 'github'),
                        eq(schema.accounts.accountId, githubUser.id.toString())
                    )
                });

                if (existingAccount) {
                    if (existingAccount.userId !== session.user.id) {
                        reply.redirect(`https://evergreeners.vercel.app/settings?error=github_account_already_linked`);
                        return;
                    }
                    // Update token
                    await db.update(schema.accounts)
                        .set({ accessToken: token.access_token, updatedAt: new Date() })
                        .where(eq(schema.accounts.id, existingAccount.id));
                } else {
                    // Create link
                    await db.insert(schema.accounts).values({
                        id: crypto.randomUUID(),
                        userId: session.user.id,
                        accountId: githubUser.id.toString(),
                        providerId: 'github',
                        accessToken: token.access_token,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
                reply.redirect(`https://evergreeners.vercel.app${targetPath}`);
                return;
            }

            // SCENARIO 2: User is NOT logged in (Login/Signup)

            // 1. Check if GitHub account is already linked
            const existingAccount = await db.query.accounts.findFirst({
                where: and(
                    eq(schema.accounts.providerId, 'github'),
                    eq(schema.accounts.accountId, githubUser.id.toString())
                )
            });

            let userId = "";

            if (existingAccount) {
                // Account exists, log them in
                userId = existingAccount.userId;
                // Update access token
                await db.update(schema.accounts)
                    .set({ accessToken: token.access_token, updatedAt: new Date() })
                    .where(eq(schema.accounts.id, existingAccount.id));
            } else {
                // Account doesn't exist. Check if user with same email exists
                const existingUser = await db.query.users.findFirst({
                    where: eq(schema.users.email, primaryEmail)
                });

                if (existingUser) {
                    // Link existing user to GitHub
                    userId = existingUser.id;
                    await db.insert(schema.accounts).values({
                        id: crypto.randomUUID(),
                        userId: existingUser.id,
                        accountId: githubUser.id.toString(),
                        providerId: 'github',
                        accessToken: token.access_token,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                } else {
                    // Create NEW user
                    userId = crypto.randomUUID();
                    await db.insert(schema.users).values({
                        id: userId,
                        name: githubUser.name || githubUser.login,
                        email: primaryEmail,
                        emailVerified: true,
                        image: githubUser.avatar_url,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    // Create account link
                    await db.insert(schema.accounts).values({
                        id: crypto.randomUUID(),
                        userId: userId,
                        accountId: githubUser.id.toString(),
                        providerId: 'github',
                        accessToken: token.access_token,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            }

            // Create Session manually since we are outside of better-auth normal flow
            const sessionToken = crypto.randomUUID();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

            await db.insert(schema.sessions).values({
                id: crypto.randomUUID(),
                userId: userId,
                token: sessionToken,
                expiresAt: expiresAt,
                createdAt: new Date(),
                updatedAt: new Date(),
                userAgent: request.headers['user-agent'],
                ipAddress: request.ip
            });

            // Set cookie
            const isSecure = process.env.NODE_ENV === 'production' || process.env.BETTER_AUTH_URL?.startsWith('https');
            const cookieName = isSecure ? "__Secure-better-auth.session_token" : "better-auth.session_token";

            reply.setCookie(cookieName, sessionToken, {
                path: '/',
                httpOnly: true,
                secure: isSecure,
                sameSite: 'none',
                expires: expiresAt
            });

            reply.redirect(`https://evergreeners.vercel.app${targetPath}`);

        } catch (err) {
            console.error(err);
            reply.redirect('https://evergreeners.vercel.app/login?error=github_callback_failed');
        }
    });

});

server.get('/', async (request, reply) => {
    return { hello: 'world' };
});

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
