import React from 'react';
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Hermes SLI - Base",
  description: "Health tracking dashboard for Hermes",
};

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col h-full w-screen'>
      <Navbar>
        <div className='flex items-center justify-start gap-8 flex-1'>
          <Link href="/overview" className='transparent p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 cursor-pointer'>
            <Image
              src="/astronaut.png"
              alt="Astronaut icon"
              width={64}
              height={64}
              className="inline-block w-16 h-16"
            />
          </Link>
          <Image
            src="/logo_icon.png"
            alt="Hermes Logo"
            width={64}
            height={64}
            className="inline-block w-24 h-24 ml-auto"
          />
        </div>
      </Navbar>
      <main className='h-full'>{children}</main>
    </div>
  );
}