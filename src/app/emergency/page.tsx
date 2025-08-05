'use client';
import React from 'react';
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from 'next/link';
import EmergencyPanel from "@/components/emergency-panel";

export default function EmergencyPage() {
  return (
    <>
      <Navbar navigation={false}>
        <div className='flex items-center justify-start gap-8 flex-1'>
          <Link
            href={"/emergency/dashboard"}
            className='transparent p-4 rounded-xl bg-white hover:bg-white/60 cursor-pointer'
          >
            <Image
              src="/monitor.png"
              alt="Monitor icon"
              width={64}
              height={64}
              className="inline-block w-16"
            />
          </Link>
          <h1 className="text-5xl font-regular text-white uppercase">Emergency Panel</h1>
          <div className='flex items-center gap-4 ml-auto mr-4'>
            <Image
              src="/users/jeremy.png"
              alt="Jeremy's avatar"
              width={64}
              height={64}
              className="rounded-full w-16 h-16 object-cover"
            />
            <p className='text-3xl font-medium text-[#929397]'>Jeremy Hansen</p>
          </div>
        </div>
      </Navbar>
      <main className='h-full'>
        <EmergencyPanel />
      </main>
    </>
  );
}