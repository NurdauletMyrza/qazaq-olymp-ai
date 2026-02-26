import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. Мұғалім үшін барлық нәтижелерді жүктеп алу (GET сұранысы)
export async function GET() {
    try {
        const theoryResults = await prisma.result.findMany({
            include: { task: true },
            orderBy: { createdAt: 'desc' }
        });

        const essayResults = await prisma.essayResult.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ theoryResults, essayResults }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Қате шықты" }, { status: 500 });
    }
}

// 2. Оқушының нәтижесін базаға сақтау (POST сұранысы)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, studentName, details, taskId, topic, essayText, score } = body;

        // Теорияны сақтау
        if (type === 'theory') {
            const newResult = await prisma.result.create({
                data: {
                    studentName,
                    details,
                    taskId
                }
            });
            return NextResponse.json({ success: true, result: newResult });
        }

        // Эссені сақтау
        if (type === 'essay') {
            const newEssayResult = await prisma.essayResult.create({
                data: {
                    studentName,
                    topic,
                    essayText,
                    details,
                    score: score || "Бағаланған"
                }
            });
            return NextResponse.json({ success: true, result: newEssayResult });
        }

        return NextResponse.json({ error: "Қате тип" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: "Сақтау қатесі", message: error.message }, { status: 500 });
    }
}