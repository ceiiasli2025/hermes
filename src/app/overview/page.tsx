'use client';
import Dashboard from "@/components/dashboard";
import React from 'react';
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from 'next/link';
import { useStatus } from "@/context/status";

export default function OverviewPage() {
  const { setCriticalStatus } = useStatus();
  return (
    <>
      <Navbar>
        <div className='flex items-center justify-start gap-8 flex-1'>
          <Link
            href={"/base"}
            className='transparent p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 cursor-pointer'
          >
            <Image
              src="/base.png"
              alt="Base icon"
              width={64}
              height={64}
              className="inline-block w-16 h-16"
            />
          </Link>
          <h1 className="text-5xl font-regular text-[#87868B] uppercase">Overview</h1>
          <button
            className='bg-red-500/20 p-2 rounded-xl animate-pulse cursor-pointer'
            onClick={() => setCriticalStatus(true)}
          >
            <Image
              src="/icons/alert.svg"
              alt="Alert icon"
              width={32}
              height={32}
              className="inline-block w-8 h-8"
            />
          </button>
          <Image
            src="/logo_icon.png"
            alt="Hermes Logo"
            width={64}
            height={64}
            className="inline-block w-24 h-24 ml-auto"
          />
        </div>
      </Navbar>
      <main className='h-full'><Dashboard/></main>
    </>
  );
}