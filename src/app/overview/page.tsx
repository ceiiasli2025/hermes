'use client';
import Dashboard from "@/components/dashboard";
import React from 'react';
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useStatus } from "@/context/status";
import NavigationItems from "@/components/navigation-items";

export default function OverviewPage() {
  const { setCriticalStatus } = useStatus();
  return (
    <>
      <Navbar>
        <div className='flex items-center justify-start gap-8 flex-1'>
          <NavigationItems />
          <button
            className='bg-red-500/20 p-2 rounded-xl animate-pulse cursor-pointer ml-auto'
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
        </div>
      </Navbar>
      <main className='h-full'><Dashboard/></main>
    </>
  );
}