import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import {
  addHomepagePublication,
  getHomepagePublicationManagerData,
  updateHomepagePublication,
  updateHomepagePublicationVisibility
} from "@/lib/services/homepage-publication-service";
import {
  createHomepagePublicationSchema,
  homepagePublicationActionSchema,
  updateHomepagePublicationSchema
} from "@/lib/validators/homepage-publication";

export async function GET() {
  try {
    const data = await getHomepagePublicationManagerData();
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = createHomepagePublicationSchema.parse(await request.json());
    const data = await addHomepagePublication(session, payload);
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = updateHomepagePublicationSchema.parse(await request.json());
    const data = await updateHomepagePublication(session, payload);
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = homepagePublicationActionSchema.parse(await request.json());
    const data = await updateHomepagePublicationVisibility(session, payload);
    return apiSuccess(data);
  } catch (error) {
    return apiError(error);
  }
}
