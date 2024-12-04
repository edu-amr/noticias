import { DefaultLayout } from "@/components/default-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";

async function fetchNoticias() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const response = await fetch(`${protocol}://${host}/api/noticias`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  
  if (!response.ok) {
    throw new Error("Falha ao buscar as notícias.");
  }

  return response.json();
}

export default async function Home() {
  let noticias: {
    id: number;
    dataPublicacao: string;
    titulo: string;
    conteudo: string;
    imagem: string;
  }[] = [];

  try {
    noticias = await fetchNoticias();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Erro ao carregar as notícias.</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Últimas Notícias</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <Card key={noticia.id} className="overflow-hidden">
              <CardHeader className="p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={noticia.imagem}
                  alt={noticia.titulo}
                  className="w-full h-48 object-cover object-right-top"
                />
              </CardHeader>
              <CardContent className="mt-4">
                <p className="text-xl font-semibold mb-2">{noticia.titulo}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {new Date(noticia.dataPublicacao).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/noticia/${noticia.id}`} className="w-full">
                  <Button className="w-full">Leia Mais</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
