import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";

type Props = {
  logo?: string | null;
  fallbackAlt: string;
  fallbackSrc: string;
};

export default function ProfileImage({
  logo,
  fallbackAlt,
  fallbackSrc,
}: Props) {
  return (
    <>
      {logo ? (
        <CldImage
          alt={fallbackAlt}
          src={logo}
          width={40}
          height={40}
          className="rounded-full hover:scale-110 transition-transform duration-300"
          crop={{
            type: "thumb",
            source: true,
          }}
        />
      ) : (
        <Image
          src={fallbackSrc}
          alt={fallbackAlt}
          width={40}
          height={40}
          className="rounded-full hover:scale-110 transition-transform duration-300"
        />
      )}
    </>
  );
}
