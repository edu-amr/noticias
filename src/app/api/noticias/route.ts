import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  try {
    const noticias = await prisma.noticia.findMany({
      orderBy: {
        dataPublicacao: 'desc',
      },
    });

    return NextResponse.json(noticias, { status: 200 });
  } catch (error) {
    console.error('Erro ao obter notícias:', error);
    return NextResponse.json(
      { error: 'Erro ao obter notícias.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const titulo = data.get('titulo') as string;
    const conteudo = data.get('conteudo') as string;
    const imagemFile = data.get('imagem') as File | null;

    if (!titulo || !conteudo || !imagemFile) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), '/public/uploads');

    fs.mkdirSync(uploadDir, { recursive: true });

    const buffer = Buffer.from(await imagemFile.arrayBuffer());
    const fileName = `${Date.now()}_${imagemFile.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const imagePath = `/uploads/${fileName}`;

    const noticia = await prisma.noticia.create({
      data: {
        titulo,
        conteudo,
        imagem: imagePath,
      },
    });

    return NextResponse.json({ noticiaId: noticia.id }, { status: 200 });
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    return NextResponse.json({ error: 'Erro ao criar notícia.' }, { status: 500 });
  }
}