import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noticiaId = parseInt(id, 10);

    if (isNaN(noticiaId)) {
      return NextResponse.json(
        { error: "ID inválido fornecido." },
        { status: 400 }
      );
    }

    const noticia = await prisma.noticia.findUnique({
      where: { id: noticiaId },
    });

    if (!noticia) {
      return NextResponse.json(
        { error: "Notícia não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(noticia, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter a notícia:", error);
    return NextResponse.json(
      { error: "Erro ao obter a notícia." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noticiaId = parseInt(id, 10);

    if (isNaN(noticiaId)) {
      return NextResponse.json(
        { error: "ID inválido fornecido." },
        { status: 400 }
      );
    }

    const data = await request.formData();
    const titulo = data.get("titulo") as string;
    const conteudo = data.get("conteudo") as string;
    const imagemFile = data.get("imagem") as File | null;

    if (!titulo || !conteudo) {
      return NextResponse.json(
        { error: "Título e conteúdo são obrigatórios." },
        { status: 400 }
      );
    }

    let imagePath = undefined;

    if (imagemFile) {
      const uploadDir = path.join(process.cwd(), "/public/uploads");
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await imagemFile.arrayBuffer());
      const fileName = `${Date.now()}_${imagemFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const noticia = await prisma.noticia.update({
      where: { id: noticiaId },
      data: {
        titulo,
        conteudo,
        ...(imagePath && { imagem: imagePath }),
      },
    });

    return NextResponse.json({ noticiaId: noticia.id }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar a notícia:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar a notícia." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noticiaId = parseInt(id, 10);

    if (isNaN(noticiaId)) {
      return NextResponse.json(
        { error: "ID inválido fornecido." },
        { status: 400 }
      );
    }

    const noticia = await prisma.noticia.delete({
      where: { id: noticiaId },
    });

    return NextResponse.json(
      { message: "Notícia excluída com sucesso.", noticiaId: noticia.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir a notícia:", error);
    return NextResponse.json(
      { error: "Erro ao excluir a notícia." },
      { status: 500 }
    );
  }
}