// lib/jwt-config.ts
import { getJwtSecret } from "./jwt-secret";

export async function getJwtConfig() {
  const jwtSecret = await getJwtSecret();

  return {
    clientSecret: jwtSecret,  // Use Redis stored secret
  };
}
