import Image from "next/image";
import React from "react";
import logo from "public/images/logo.png";
import { useRouter } from "next/router";

export const Header: React.FC<{}> = () => {
  const router = useRouter();

  const onBackButton = () => {
    router.back();
  };

  return (
    <div className="flex items-center p-4">
      {router.pathname !== "/" && (
        <button onClick={onBackButton} className="mr-4 text-yellow">
          Voltar
        </button>
      )}
      <Image
        alt="Logo do Fut Elétrica 2013"
        src={logo}
        width="56"
        height="67"
      />
      <h1 className=" ml-4 text-2xl text-yellow">Fut Elétrica 2013</h1>
    </div>
  );
};
