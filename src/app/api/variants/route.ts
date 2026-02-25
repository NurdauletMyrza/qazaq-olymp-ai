import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Алдыңғы қадамда жасаған prisma файлымыз

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, literature, language } = body;

        // Тексеру: Нұсқаның аты жазылған ба?
        if (!title) {
            return NextResponse.json({ error: "Нұсқаның атауын жазу міндетті" }, { status: 400 });
        }

        // Prisma арқылы базаға жаңа жазба (Variant) қосу
        const newVariant = await prisma.variant.create({
            data: {
                title: title,
                literature: literature, // JSON форматындағы 10 сұрақ автоматты сақталады
                phoneticsQuestion: language.phonetics.question,
                phoneticsExpected: language.phonetics.expectedAnswer,
                morphologyQuestion: language.morphology.question,
                morphologyExpected: language.morphology.expectedAnswer,
                syntaxQuestion: language.syntax.question,
                syntaxExpected: language.syntax.expectedAnswer,
                lexicologyQuestion: language.lexicology.question,
                lexicologyExpected: language.lexicology.expectedAnswer,
            }
        });

        return NextResponse.json({ success: true, variant: newVariant }, { status: 201 });

    } catch (error: any) {
        console.error("Базаға сақтау қатесі:", error);
        return NextResponse.json({
            error: "Серверде қате орын алды, деректер сақталмады",
            details: error.message
        }, { status: 500 });
    }
}