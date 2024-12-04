"use client";

import { useState, useEffect } from "react";
import { DefaultLayout } from "@/components/default-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import { FormNews } from "@/app/_components/form-news";
import { useParams } from "next/navigation";

interface Noticia {
  id: number;
  dataPublicacao: string;
  titulo: string;
  conteudo: string;
  imagem: string;
}

export default function NoticiaPage() {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const noticiaId = Number(params.id);

  useEffect(() => {
    if (isNaN(noticiaId)) {
      setError("ID inválido fornecido.");
      return;
    }

    const fetchNoticia = async () => {
      try {
        const response = await fetch(`/api/noticias/${noticiaId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          setError("Erro ao carregar ou notícia não encontrada.");
          return;
        }

        const data = await response.json();
        setNoticia(data);
      } catch (err) {
        setError("Erro ao carregar ou notícia não encontrada.");
      }
    };

    fetchNoticia();
  }, [noticiaId]);

  if (error) {
    return (
      <DefaultLayout>
        <div className="container mx-auto py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </DefaultLayout>
    );
  }

  if (!noticia) {
    return (
      <DefaultLayout>
        <div className="container mx-auto py-8">
          <p>Carregando...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto py-8">
        <div className="flex gap-5 mb-8">
          <Link href={"/"}>
            <Button variant={"outline"} className="flex items-center gap-2">
              <ArrowBigLeft size={16} />
              Ir para Home
            </Button>
          </Link>
        </div>
        {/* Passa os dados da notícia para o FormNews */}
        <FormNews noticia={noticia} />
      </div>
    </DefaultLayout>
  );
}
