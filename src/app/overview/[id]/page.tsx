'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from 'next/link';
import { data } from "@/lib/data-mock"
import Waveform from '@/components/waveform';
import { MedicalRecordModal } from '@/components/medical-record';

export default function UserOverviewPage() {
  const params = useParams();
  const id = params?.id;
  const userId = typeof id === 'string' ? Number(id) : Array.isArray(id) ? Number(id[0]) : undefined;
  const user = data.find(user => user.id === userId);
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);

  const handleCloseMedicalRecord = () => {
    setShowMedicalRecord(false);
  };
  return (
    <>
      <MedicalRecordModal isOpen={showMedicalRecord} onClose={handleCloseMedicalRecord} user={user} />
      <Navbar>
        <div className='flex items-center justify-start gap-8 flex-1'>
          <Link
            href={"/overview"}
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
          <h1 className="text-5xl font-regular text-[#87868B] uppercase">{user?.nickname}'s health dashboard</h1>
          <button
            className='cursor-pointer p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 ml-auto'
            onClick={() => setShowMedicalRecord(true)}
          >
            <Image
              src="/record.png"
              alt="Medical record icon"
              width={64}
              height={64}
              className="inline-block w-16 h-16"
            />
          </button>
        </div>
      </Navbar>
      <main className='h-full grid grid-cols-5'>
        <div className='h-full col-span-3 bg-[#151618]'>
          <Waveform user={user} />
        </div>
        <div className='h-full col-span-2 flex flex-col gap-16 p-8 items-center justify-center'>
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
          <div className='flex flex-col w-full rounded-xl bg-[#151618] p-4 gap-8'>
            <p className='text-3xl uppercase text-white font-roboto font-medium'>Mental stage</p>
            <div className='flex items-center justify-between gap-4'>
              <div className="relative inline-block">
                <div className="w-72 h-24 bg-[#95969A] rounded-xl p-2">
                  <div className='w-full bg-[#5B5C5E] relative h-full rounded-lg overflow-hidden'>
                    <div
                      style={{ width: `${user?.mentalStage.percentage}%` }}
                      className={`absolute inset-y-0 left-0 h-full bg-[#246E10] rounded-lg`}
                    />
                  </div>
                </div>
                <div className="absolute top-1/2 -translate-1/2 -right-4 h-12 flex items-center justify-center w-4 bg-[#95969A] rounded-r-sm"/>
              </div>
              <p className='text-4xl uppercase text-white font-roboto font-medium'>{user?.mentalStage.percentage}%</p>
            </div>
            <div className='flex items-center justify-between text-2xl text-white font-roboto'>
              <p>Sleep</p>
              <p>{user?.mentalStage.sleep}</p>
            </div>
            <div className='flex items-center justify-between text-2xl text-white font-roboto'>
              <p>Cognitive Performance</p>
              <p>{user?.mentalStage.cognitivePerformance}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}