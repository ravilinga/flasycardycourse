import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env file manually (no dotenv dependency needed)
const envPath = resolve(process.cwd(), ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env not found, rely on existing env vars
}

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const SSO_CARDS = [
  {
    front: "What is Single Sign-On (SSO)?",
    back: "SSO is an authentication scheme that lets a user log in once and gain access to multiple independent systems without re-authenticating. A central Identity Provider (IdP) issues a token after the initial login; each Service Provider (SP) trusts that token.",
  },
  {
    front: "What is an Identity Provider (IdP)?",
    back: "An IdP is the trusted system that authenticates the user and issues identity assertions (tokens/assertions). Examples: Okta, Azure AD, Auth0, Google Workspace, Keycloak. The IdP owns the user's credentials and session.",
  },
  {
    front: "What is a Service Provider (SP)?",
    back: "An SP (also called a Relying Party in OAuth/OIDC) is an application that relies on the IdP to authenticate users. The SP redirects unauthenticated users to the IdP and consumes the token/assertion returned after login.",
  },
  {
    front: "What protocols are commonly used for SSO?",
    back: "• SAML 2.0 – XML-based, enterprise standard, browser-based SSO\n• OAuth 2.0 – authorization framework (not authentication by itself)\n• OpenID Connect (OIDC) – identity layer on top of OAuth 2.0, returns ID tokens (JWTs)\n• LDAP/Kerberos – used in on-premises/Windows environments",
  },
  {
    front: "What is SAML 2.0?",
    back: "Security Assertion Markup Language 2.0 is an XML-based open standard for exchanging authentication and authorization data between an IdP and an SP. It uses digitally signed XML assertions and is common in enterprise/B2B SSO scenarios.",
  },
  {
    front: "What is the SAML SSO flow (SP-initiated)?",
    back: "1. User visits the SP.\n2. SP generates an AuthnRequest and redirects the user to the IdP.\n3. User authenticates at the IdP.\n4. IdP sends a signed SAML Response (with Assertion) to the SP via the user's browser (POST binding).\n5. SP validates the signature, extracts attributes, and creates a session.",
  },
  {
    front: "What is OpenID Connect (OIDC)?",
    back: "OIDC is an identity layer built on top of OAuth 2.0. After a user authenticates, the authorization server returns an ID Token (a JWT) containing claims about the user (sub, email, name). It also defines a UserInfo endpoint for additional claims.",
  },
  {
    front: "What is the difference between OAuth 2.0 and OIDC?",
    back: "OAuth 2.0 is an authorization framework — it grants access to resources via access tokens but says nothing about user identity. OIDC extends OAuth 2.0 with authentication: it adds the ID Token (JWT) that identifies who the user is.",
  },
  {
    front: "What is a JWT (JSON Web Token)?",
    back: "A JWT is a compact, URL-safe token consisting of three Base64URL-encoded parts separated by dots: Header.Payload.Signature. The header specifies the algorithm, the payload contains claims (sub, iss, exp, aud, etc.), and the signature ensures integrity.",
  },
  {
    front: "What are the key JWT claims used in SSO?",
    back: "• iss (Issuer) – who issued the token (the IdP URL)\n• sub (Subject) – unique user identifier\n• aud (Audience) – intended recipient (the SP/client)\n• exp (Expiration) – Unix timestamp when the token expires\n• iat (Issued At) – when the token was issued\n• nonce – prevents replay attacks in OIDC flows",
  },
  {
    front: "What is the Authorization Code Flow in OIDC/OAuth?",
    back: "1. App redirects user to IdP with response_type=code.\n2. User authenticates; IdP redirects back with a short-lived authorization code.\n3. App exchanges the code for tokens (access_token, id_token, refresh_token) at the token endpoint — this happens server-to-server.\nThis flow keeps tokens out of the browser URL.",
  },
  {
    front: "What is PKCE and why is it used?",
    back: "Proof Key for Code Exchange (PKCE, pronounced 'pixie') is an extension to the Authorization Code Flow for public clients (SPAs, mobile apps). The client generates a code_verifier, hashes it to a code_challenge sent with the auth request, then sends the raw verifier when exchanging the code — preventing authorization code interception attacks.",
  },
  {
    front: "What is Single Logout (SLO)?",
    back: "SLO allows a user to log out of all SP sessions by logging out at the IdP once. The IdP sends logout requests to all SPs that have active sessions for that user. SAML and OIDC both define SLO mechanisms (front-channel via browser redirects or back-channel via direct HTTP calls).",
  },
  {
    front: "What is federated identity?",
    back: "Federated identity is the linking of a user's identity across separate security domains (organizations or systems) without sharing passwords. SSO across company boundaries (e.g., a SaaS app trusting a customer's corporate IdP) is an example of identity federation.",
  },
  {
    front: "What is a SAML Assertion?",
    back: "A SAML Assertion is the XML document issued by the IdP that contains authentication statements (the user authenticated at time T), attribute statements (email, roles, etc.), and an authorization decision. It is digitally signed and optionally encrypted.",
  },
  {
    front: "What is the difference between SP-initiated and IdP-initiated SSO?",
    back: "SP-initiated: User starts at the SP, is redirected to the IdP for authentication, then back to the SP.\nIdP-initiated: User starts at the IdP (e.g., an app portal), selects an app, and the IdP sends an assertion directly to the SP without an explicit AuthnRequest. IdP-initiated is less secure and harder to validate.",
  },
  {
    front: "What is a Refresh Token?",
    back: "A refresh token is a long-lived credential used to obtain new access tokens without re-authenticating the user. It is stored securely (server-side or in httpOnly cookies) and sent to the token endpoint. If a refresh token is compromised, all sessions using it can be invalidated.",
  },
  {
    front: "What is token introspection?",
    back: "Token introspection (RFC 7662) is an OAuth 2.0 endpoint that allows a resource server to query the authorization server to determine whether an access token is active, its scopes, expiry, and the user it belongs to — useful for opaque (non-JWT) tokens.",
  },
  {
    front: "What is the difference between authentication and authorization?",
    back: "Authentication (AuthN) verifies who you are (identity) — e.g., 'You are Alice'.\nAuthorization (AuthZ) determines what you are allowed to do — e.g., 'Alice can read invoices but not delete them'.\nSSO handles authentication; role/permission systems handle authorization.",
  },
  {
    front: "What is a SCIM?",
    back: "System for Cross-domain Identity Management (SCIM) is a standard REST API and JSON schema for automating user provisioning and deprovisioning between an IdP and SPs. When a user is created/updated/deactivated in the IdP, SCIM syncs those changes to connected apps automatically.",
  },
  {
    front: "What are common SSO security risks?",
    back: "• Token theft / session hijacking — compromise one token, access all apps\n• IdP compromise — single point of failure for all connected apps\n• SAML XML signature wrapping attacks\n• Open redirects in OAuth flows\n• Missing nonce/state parameter — CSRF & replay attacks\nMitigations: short token lifetimes, PKCE, strict redirect URI validation, MFA at the IdP.",
  },
  {
    front: "What is the 'state' parameter in OAuth 2.0?",
    back: "The state parameter is an opaque value the client generates and sends in the authorization request. The IdP returns it unchanged in the redirect. The client verifies it matches to prevent CSRF attacks and to restore local UI state (e.g., the page the user was trying to reach).",
  },
];

async function main() {
  const existingDecks = await db
    .select({ clerkUserId: schema.decks.clerkUserId })
    .from(schema.decks)
    .limit(1);

  const userId = process.env.SEED_USER_ID ?? existingDecks[0]?.clerkUserId;

  if (!userId) {
    console.error(
      "No existing user found in the database.\n" +
        "Please provide your Clerk user ID:\n\n" +
        "  SEED_USER_ID=user_xxxxx npx tsx scripts/seed-sso.ts\n"
    );
    process.exit(1);
  }

  console.log(`Seeding SSO deck for userId: ${userId}`);

  const [deck] = await db
    .insert(schema.decks)
    .values({
      clerkUserId: userId,
      title: "SSO Concepts",
      description:
        "Single Sign-On concepts covering SAML, OIDC, OAuth 2.0, JWTs, and SSO security for interview prep and self-study.",
    })
    .returning();

  console.log(`Created deck: "${deck.title}" (${deck.id})`);

  await db
    .insert(schema.cards)
    .values(SSO_CARDS.map((card) => ({ deckId: deck.id, ...card })));

  console.log(`Inserted ${SSO_CARDS.length} cards. Done!`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
