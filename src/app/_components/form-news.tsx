"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

interface FormNewsProps {
  noticia?: {
    id: number;
    titulo: string;
    conteudo: string;
    imagem: string;
  };
}

export function FormNews({ noticia }: FormNewsProps) {
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState(noticia?.titulo || "");
  const [conteudo, setConteudo] = useState(noticia?.conteudo || "");
  const [existingImage, setExistingImage] = useState(noticia?.imagem || "");
  const router = useRouter();

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setExistingImage("");
      setError(null);
    } else {
      setError("Apenas arquivos de imagem são permitidos.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !conteudo || (!imageFile && !existingImage)) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
  
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("conteudo", conteudo);
    if (imageFile) formData.append("imagem", imageFile);
  
    const method = noticia ? "PUT" : "POST";
    const url = noticia ? `/api/noticias/${noticia.id}` : "/api/noticias";
  
    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar notícia.");
      }
  
      const data = await response.json();
      router.refresh();
      router.push(`/noticia/${data.noticiaId}`);
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-[500px] mx-auto mt-10">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium">
          Título
        </label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite o título da notícia"
        />
      </div>
      <div>
        <label htmlFor="conteudo" className="block text-sm font-medium">
          Conteúdo
        </label>
        <Textarea
          id="conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Digite o conteúdo da notícia"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Imagem</label>
        <div
          {...getRootProps({
            className:
              "border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer rounded-md",
          })}
        >
          <input {...getInputProps()} />
          {imageFile ? (
            <p>{imageFile.name}</p>
          ) : existingImage ? (
            <div className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={existingImage}
                alt="Imagem atual"
                className="h-48 w-auto object-contain mb-2"
              />
              <p className="text-sm text-gray-500">
                Arraste e solte uma nova imagem para substituir
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon size={48} className="text-gray-400" />
              <p className="text-sm text-gray-500">
                Arraste e solte uma imagem ou clique aqui
              </p>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">{noticia ? "Salvar Alterações" : "Criar Notícia"}</Button>
    </form>
  );
}
