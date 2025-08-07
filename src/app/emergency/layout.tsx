'use client';
import React from 'react';

export default function EmergencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col h-screen w-screen'>
      {children}
    </div>
  );
}