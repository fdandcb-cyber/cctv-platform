import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.cctvProduct.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product = await db.cctvProduct.update({
      where: { id },
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
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.cctvProduct.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}