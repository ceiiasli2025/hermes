'use client';
import React from 'react';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col h-full w-screen'>
      {children}
    </div>
  );
}