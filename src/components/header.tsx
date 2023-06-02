import Image from "next/image";
import React from "react";
import logo from "public/images/logo.png";
import Link from "next/link";

export const Header: React.FC<{}> = () => (
  <Link href={"/"} className="flex items-center p-4">
    <Image alt="Logo do Fut Elétrica 2013" src={logo} width="56" height="67" priority={true} />
    <h1 className=" ml-4 text-2xl text-yellow">Fut Elétrica 2013</h1>
  </Link>
);
