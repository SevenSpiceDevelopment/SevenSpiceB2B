import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getSiteSettingsFresh } from "./db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        // Fetch current settings (may store hashed custom password)
        const settings = await getSiteSettingsFresh();
        
        const adminEmail = process.env.ADMIN_EMAIL;
        
        console.log("[AUTH DEBUG] Attempt:", {
          inputEmail: credentials.email,
          envEmail: adminEmail,
          envEmailExists: !!adminEmail,
          envPasswordExists: !!process.env.ADMIN_PASSWORD,
          dbPasswordExists: !!settings?.admin_password,
        });

        if (!adminEmail) {
          console.error("[AUTH] ADMIN_EMAIL environment variable is not set.");
          return null;
        }

        // Email must match (trim and lowercase for robustness)
        if (credentials.email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
          console.log("[AUTH DEBUG] Email mismatch");
          return null;
        }

        // Password verification:
        // Priority 1: Hashed password stored in DB (set via admin panel)
        // Priority 2: Plaintext password from env var (initial setup)
        let isPasswordValid = false;

        if (settings?.admin_password) {
          // DB password is bcrypt-hashed — use secure comparison
          isPasswordValid = await bcrypt.compare(credentials.password, settings.admin_password);
          console.log("[AUTH DEBUG] DB Password verified. Result:", isPasswordValid);
        } else if (process.env.ADMIN_PASSWORD) {
          // Fallback to env var for first-time setup (plaintext comparison)
          isPasswordValid = credentials.password === process.env.ADMIN_PASSWORD;
          console.log("[AUTH DEBUG] Env Password verified. Result:", isPasswordValid);
        } else {
          console.error("[AUTH] No admin password configured. Set ADMIN_PASSWORD in environment variables.");
          return null;
        }

        if (!isPasswordValid) {
          return null;
        }

        return { 
          id: "admin", 
          name: "Seven Spice Admin", 
          email: adminEmail,
          role: "admin"
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
