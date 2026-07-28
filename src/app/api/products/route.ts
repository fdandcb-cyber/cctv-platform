import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// ─── Helper: verify admin from Authorization header ───
function getAdminFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const cameraType = searchParams.get("cameraType");
    const recorderType = searchParams.get("recorderType");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const maxPrice = searchParams.get("maxPrice");
    const minPrice = searchParams.get("minPrice");

    const where: Record<string, unknown> = {};

    if (brand && brand !== "all") where.brand = brand;
    if (cameraType && cameraType !== "all") where.cameraType = cameraType;
    if (recorderType && recorderType !== "all") where.recorderType = recorderType;
    if (maxPrice) where.price = { ...((where.price as Record<string, unknown>) || {}), lte: parseFloat(maxPrice) };
    if (minPrice) where.price = { ...((where.price as Record<string, unknown>) || {}), gte: parseFloat(minPrice) };
    if (search) {
      where.OR = [
        { modelName: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await db.cctvProduct.findMany({
      where,
      orderBy: { [sortBy]: order as "asc" | "desc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Require admin authentication
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — admin access required" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const product = await db.cctvProduct.create({
      data: {
        brand: body.brand,
        modelName: body.modelName,
        cameraType: body.cameraType,
        resolution: body.resolution,
        technology: body.technology,
        recorderType: body.recorderType,
        nightVision: body.nightVision,
        weatherRating: body.weatherRating,
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        description: body.description,
        features: body.features,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl || null,
        sampleVideoUrl: body.sampleVideoUrl || null,
        irRange: body.irRange || "",
        fieldOfView: body.fieldOfView || "",
      },
    });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}