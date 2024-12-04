"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="w-full">
      <header className="flex justify-end items-center py-4 px-6 bg-gray-100">
        {session?.user ? (
          <div className="flex justify-between items-center gap-6">
            <Link href={"/criar-noticia"}>
              <Button>Criar notícia</Button>
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session?.user?.image ?? ""}
                alt={session?.user?.name ?? "Avatar"}
              />
              <AvatarFallback>
                {session?.user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button onClick={() => signOut()}>
              Sair
            </Button>
          </div>
        ) : (
          <Link href={"/login"}>
            <Button>Entrar</Button>
          </Link>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
