'use client';
import React from 'react';

export default function EmergencyLayout({
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