"use client";

import { useState, useEffect } from "react";
import { DefaultLayout } from "@/components/default-layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, PencilLine, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const router = useRouter();
  const params = useParams();
  const noticiaId = Number(params.id);
  const { data: session } = useSession();

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
      } catch {
        setError("Erro ao carregar ou notícia não encontrada.");
      }
    };

    fetchNoticia();
  }, [noticiaId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/noticias/${noticiaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Erro ao excluir a notícia.");
      }
    } catch (error) {
      console.error("Erro ao excluir a notícia:", error);
    }
  };

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
        <div className="flex gap-5">
          <Link href={"/"}>
            <Button variant={"outline"} className="flex items-center gap-2">
              <ArrowBigLeft size={16} />
              Ir para Home
            </Button>
          </Link>
          {session?.user && (
            <>
              <Button
                onClick={handleDelete}
                className="flex items-center gap-2"
                variant={"destructive"}
              >
                <Trash2 size={16} />
                Excluir
              </Button>
              <Link href={`/editar-noticia/${noticia.id}`}>
                <Button className="flex items-center gap-2">
                  <PencilLine size={16} />
                  Editar
                </Button>
              </Link>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-4 mt-10">{noticia.titulo}</h1>
        <p className="text-gray-600 mb-4">
          {new Date(noticia.dataPublicacao).toLocaleDateString()}
        </p>
        <div className="relative h-96 mb-6">
          <Image
            src={noticia.imagem}
            alt={noticia.titulo}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <p className="text-lg">{noticia.conteudo}</p>
      </div>
    </DefaultLayout>
  );
}
