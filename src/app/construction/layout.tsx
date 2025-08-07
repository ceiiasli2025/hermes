import React from 'react';
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import NavigationItems from "@/components/navigation-items";

export const metadata: Metadata = {
  title: "Hermes SLI - Construction",
  description: "Health tracking dashboard for Hermes",
};

export default function ConstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Navbar navigation={false}>
        <div className='flex items-center justify-start gap-8 flex-1'>
          <NavigationItems />
        </div>
      </Navbar>
      <main className='h-full'>{children}</main>
    </div>
  );
  
}