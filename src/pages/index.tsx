import Link from "next/link";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";

export default function Home() {
  return (
    <>
      <PageHead description="Confira o maior time do sul do mundo!" />
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="flex flex-col items-center">
          <Link href={`/jogo`}>
            <Button>Jogos</Button>
          </Link>
          <Link href={`/atletas`}>
            <Button>Atletas</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
