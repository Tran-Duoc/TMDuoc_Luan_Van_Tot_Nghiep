import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="relative flex items-center">
      <Image src="/images/cit.png" alt="Logo CIT" width={50} height={50} />
      <span className="capitalize text-blue-500">
        CIT Machine Learning Tools
      </span>
    </Link>
  );
};

export default Logo;
