'use client';
import React from 'react';
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from 'next/link';
import Waveform from "@/components/waveform";
import {
  ChevronUp,
  ChevronDown,
  MoveUp,
} from 'lucide-react';

const user = {
    id: 5,
    img: '/users/jeremy.png',
    nickname: 'Jeremy',
    name: 'Jeremy Hansen',
    birthdate: 'Jan 27, 1976',
    gender: 'Male',
    bloodType: 'B+',
    location: 'Kitchen',
    ecgBpm: 220,
    spo2: 95,
    systolic: 60,
    diastolic: 40,
    etco2: 4,
    respiratoryRate: 24,
    bodyTemperature: 36,
    glucoseLevel: 80,
    mentalStage: {
      percentage: 100,
      sleep: 'Sleep well',
      cognitivePerformance: 'Normal'
    }
  }

export default function EmergencyPage() {
  return (
    <>
      <Navbar navigation={false}>
        <div className='flex items-center justify-start gap-8 flex-1'>
          <Link
            href={"/emergency"}
            className='transparent p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 cursor-pointer'
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="none"
              stroke="#87868B"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              className="w-16 h-16"
              viewBox="0 0 24 24"
            >
              <path d="m6 8-4 4 4 4M2 12h20"></path>
            </svg>
          </Link>
          <h1 className="text-5xl font-regular text-[#87868B] uppercase">Jeremy's health dashboard</h1>
          <div className='flex items-center gap-4 ml-auto mr-4'>
            <Image
              src="/users/jeremy.png"
              alt="Jeremy's avatar"
              width={64}
              height={64}
              className="rounded-full w-16 h-16 object-cover"
            />
          </div>
        </div>
      </Navbar>
      <main className='h-full grid grid-cols-5'>
        <div className='h-full col-span-3 bg-[#151618]'>
          <Waveform user={user} />
        </div>
        <div className='h-full col-span-2 flex flex-col gap-8 p-8 items-center justify-start'>
          <div className='flex flex-col w-full rounded-xl bg-[#151618] p-4 gap-8'>
            <div className='flex items-center justify-between'>
              <p className='text-3xl uppercase text-white font-roboto'>Body temperature</p>
              <p className='text-4xl text-white font-roboto'>{user?.bodyTemperature}°C</p>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-3xl uppercase text-white font-roboto'>Glucose level</p>
              <p className='text-4xl text-white font-roboto'>{user?.glucoseLevel} mg/dL</p>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-3xl uppercase text-white font-roboto'>Blood pressure</p>
              <p className='text-4xl text-white font-roboto'>{user?.systolic}/{user?.diastolic} mmHg</p>
            </div>
          </div>
          <div className='flex flex-col w-full rounded-xl bg-[#151618]'>
            <div className='flex items-center gap-2 border-b-3 border-[#87868B] px-2 py-4'>
              <ChevronUp className='!size-8 text-[#87868B]' />
              <p className='text-4xl uppercase text-white font-roboto'>SUIT</p>
            </div>
            <div className='gap-2 border-b-3 border-[#87868B] px-2 py-4 grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 font-semibold'>
              <div className='flex items-center justify-center gap-1'>
                <MoveUp className='!size-8 text-white rotate-90' />
                <p className='text-4xl uppercase text-white font-roboto'>29 <span className='text-xl'>ºC</span></p>
              </div>
              <div className='flex items-center justify-center gap-1'>
                <MoveUp className='!size-8 text-white rotate-90' />
                <p className='text-4xl uppercase text-white font-roboto'>4,3 <span className='text-xl'>psi</span></p>
              </div>
              <div className='flex items-center justify-center gap-1'>
                <MoveUp className='!size-8 text-white rotate-45' />
                <p className='text-4xl uppercase text-white font-roboto'>21%<span className='text-xl'>O2</span></p>
              </div>
              <div className='flex items-center justify-center gap-1'>
                <MoveUp className='!size-8 text-white rotate-[135deg]' />
                <p className='text-4xl uppercase text-white font-roboto'>0,7%<span className='text-xl'>CO2</span></p>
              </div>
            </div>
            <div className='flex items-center gap-2 border-b-3 border-[#87868B] px-2 py-4'>
              <ChevronDown className='!size-8 text-[#87868B]' />
              <p className='text-4xl uppercase text-white font-roboto'>Rover</p>
            </div>
            <div className='flex items-center gap-2 px-2 py-4'>
              <ChevronDown className='!size-8 text-[#87868B]' />
              <p className='text-4xl uppercase text-white font-roboto'>Emergency room</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}