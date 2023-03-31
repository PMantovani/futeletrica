import { Autocomplete } from "@/components/autocomplete";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { IconButton } from "@/components/icon_button";
import { Main } from "@/components/main";
import { formatDate } from "@/formatters/date_formatter";
import { trpc } from "@/utils/trpc";
import { validateRouterQueryToNumber } from "@/utils/validate_router_query";
import { Athlete } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";

const RosterAdmin: NextPage = () => {
  const router = useRouter();
  const gameIdNumber = validateRouterQueryToNumber(router.query.gameId);
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([]);

  const { data: game } = trpc.game.findById.useQuery(gameIdNumber);
  const { data: allAthletesQueryData } = trpc.athlete.findAll.useQuery();
  const [availableAthletes, setAvailableAthletes] = useState(allAthletesQueryData ?? []);
  const generateRostersMutation = trpc.game.roster.generateRoster.useMutation({
    onError: (err) => toast.error("Erro ao criar escalação"),
    onSuccess: () => toast.success("Escalação criada com sucesso"),
  });

  useEffect(() => {
    setAvailableAthletes((allAthletesQueryData ?? []).filter((a) => !selectedAthletes.includes(a)));
  }, [allAthletesQueryData, selectedAthletes]);

  if (!game) {
    return <div></div>;
  }

  const generateRosters = () => {
    generateRostersMutation.mutate({ gameId: BigInt(gameIdNumber), athleteIds: selectedAthletes.map((i) => i.id) });
  };

  return (
    <Main>
      <Header />
      <h2 className="mx-auto mb-10 text-2xl">Convocados do dia {formatDate(game.gameDate)}</h2>
      <div className="mx-auto mb-48 flex flex-col items-center">
        {selectedAthletes.map((athlete, idx) => (
          <div key={idx} className=" flex items-center py-2">
            <IconButton
              onClick={() => setSelectedAthletes(selectedAthletes.filter((_, arrIdx) => idx !== arrIdx))}
              className="mr-4 text-red-700"
            >
              <MdClose />
            </IconButton>
            <div>
              {idx + 1}. {athlete.name}
            </div>
          </div>
        ))}
        {availableAthletes && (
          <>
            <div className="pt-10 text-lg font-bold">Adicione novos jogadores a convocação</div>
            <Autocomplete
              className="pt-10"
              onSelect={(val) => setSelectedAthletes([...selectedAthletes, val])}
              filter={(val) => availableAthletes.filter((a) => a.name.toLowerCase().includes(val.toLowerCase()))}
              toLabel={(val: Athlete) => val.name}
            />
          </>
        )}
        <Button onClick={generateRosters} disabled={selectedAthletes.length !== 15} className="mt-6">
          Gerar escalação
        </Button>
        {selectedAthletes.length < 15 && <p className="text-xs">Atletas selecionados: {selectedAthletes.length}/15</p>}
      </div>
    </Main>
  );
};

export default RosterAdmin;
