import type { Handle } from "@sveltejs/kit";
import { verifyAdminSession } from "#lib/server/auth";
import { ensureDatabaseInitialized } from "#lib/db";

export const handle: Handle = async ({ event, resolve }) => {
  await ensureDatabaseInitialized();
  event.locals.isAdmin = await verifyAdminSession(event.cookies);
  return resolve(event);
};
