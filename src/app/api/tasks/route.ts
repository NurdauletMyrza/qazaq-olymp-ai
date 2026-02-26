import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, category, content } = body;

        if (!title || !category || !content) {
            return NextResponse.json({ error: "Барлық жолдарды толтыру міндетті!" }, { status: 400 });
        }

        // Базаға жаңа тапсырманы сақтау
        const newTask = await prisma.theoryTask.create({
            data: {
                title,
                category,
                content, // JSON форматындағы сұрақ-жауаптар
            }
        });

        return NextResponse.json({ success: true, task: newTask }, { status: 201 });

    } catch (error: any) {
        console.error("Сақтау қатесі:", error);
        return NextResponse.json({ error: "Серверлік қате", details: error.message }, { status: 500 });
    }
}