import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";

async function findUser(username, role) {
  const rows = await query(
    "SELECT user_id, username, password, full_name, email, role, avatar FROM users WHERE username=? AND role=? LIMIT 1",
    [username, role]
  );
  return rows?.[0] || null;
}

async function upgradePasswordIfNeeded(user, plain) {
  try {
    if (!user.password?.startsWith("$2")) {
      const hash = await bcrypt.hash(plain, 10);
      await query("UPDATE users SET password=? WHERE user_id=?", [
        hash,
        user.user_id,
      ]);
      user.password = hash;
    }
  } catch (e) {
    // best-effort; ignore failures
  }
}

export const authOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const { username, password, role } = credentials || {};
        if (!username || !password || !role) return null;
        const user = await findUser(username, role);
        if (!user) return null;

        if (!user.password?.startsWith("$2")) {
          // plaintext in DB; compare directly then upgrade
          if (password !== user.password) return null;
          await upgradePasswordIfNeeded(user, password);
        } else {
          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;
        }

        return {
          id: String(user.user_id),
          name: user.full_name,
          email: user.email,
          image: user.avatar,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Always refetch latest user fields from DB to keep session fresh
      try {
        const rows = await query(
          "SELECT username, full_name, email, avatar, role FROM users WHERE user_id = ? LIMIT 1",
          [token.id]
        );
        const u = rows?.[0];
        if (u) {
          session.user.id = token.id;
          session.user.role = u.role;
          session.user.username = u.username;
          session.user.name = u.full_name;
          session.user.email = u.email;
          session.user.image = u.avatar;
          return session;
        }
      } catch (e) {
        // fall back to token values if DB lookup fails
      }
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    },
  },
};

export async function auth() {
  return await getServerSession(authOptions);
}
