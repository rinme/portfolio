import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as actions from "#lib/server/actions";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.isAdmin) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, payload } = await request.json();

    switch (action) {
      case "updateProfile": {
        const res = await actions.updateProfileAction(payload);
        return json(res);
      }
      case "addSocialLink": {
        const res = await actions.addSocialLinkAction(payload);
        return json(res);
      }
      case "toggleSocialLink": {
        const res = await actions.toggleSocialLinkActiveAction(payload.id, payload.isActive);
        return json(res);
      }
      case "updateSocialLink": {
        const res = await actions.updateSocialLinkAction(payload.id, payload.data);
        return json(res);
      }
      case "deleteSocialLink": {
        const res = await actions.deleteSocialLinkAction(payload.id);
        return json(res);
      }
      case "saveProject": {
        const res = await actions.saveProjectAction(payload);
        return json(res);
      }
      case "deleteProject": {
        const res = await actions.deleteProjectAction(payload.id);
        return json(res);
      }
      case "saveExperience": {
        const res = await actions.saveExperienceAction(payload);
        return json(res);
      }
      case "deleteExperience": {
        const res = await actions.deleteExperienceAction(payload.id);
        return json(res);
      }
      case "saveSkill": {
        const res = await actions.saveSkillAction(payload);
        return json(res);
      }
      case "deleteSkill": {
        const res = await actions.deleteSkillAction(payload.id);
        return json(res);
      }
      case "saveTestimonial": {
        const res = await actions.saveTestimonialAction(payload);
        return json(res);
      }
      case "deleteTestimonial": {
        const res = await actions.deleteTestimonialAction(payload.id);
        return json(res);
      }
      case "updateInquiryStatus": {
        const res = await actions.updateInquiryStatusAction(payload.id, payload.status, payload.internalNotes);
        return json(res);
      }
      case "deleteInquiry": {
        const res = await actions.deleteInquiryAction(payload.id);
        return json(res);
      }
      case "reorderItems": {
        const res = await actions.reorderItemsAction(payload.entity, payload.orderedIds);
        return json(res);
      }
      default:
        return json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Admin action failed:", err);
    return json({ error: err.message || "Action failed" }, { status: 500 });
  }
};
