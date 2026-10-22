import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { submitContactInquiry } from "#lib/server/actions";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const res = await submitContactInquiry(data);
    if (!res.success) {
      return json(res, { status: 400 });
    }
    return json(res);
  } catch (err: any) {
    return json({ success: false, error: err.message || "Failed to submit" }, { status: 500 });
  }
};
