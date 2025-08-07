'use client';
import React from 'react';
import { StatusProvider } from "@/context/status";


export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StatusProvider>
      <div className='flex flex-col h-screen w-screen'>
        {children}
      </div>
    </StatusProvider>
  );
}