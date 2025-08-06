import { FC } from 'react';
import Image from 'next/image';

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

export const MedicalRecordModal: FC<MedicalRecordModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-[100]">
      <div className="bg-[#1C1D1F] rounded-lg p-4 relative min-w-[800px] flex flex-col gap-2">
        <div className='grid grid-cols-6 mb-8 '>
          <button
            className="col-span-1 cursor-pointer"
            onClick={onClose}
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
              className="w-20 h-20"
              viewBox="0 0 24 24"
            >
              <path d="m6 8-4 4 4 4M2 12h20"></path>
            </svg>
          </button>
          <p className='col-span-4 text-[#D1546C] uppercase text-5xl text-center flex items-center justify-center'>Medical record</p>
        </div>
        <div className='grid grid-cols-3'>
          <div className='flex items-center gap-4'>
            <p className='text-3xl uppercase text-[#9FA8AF] font-roboto'>Name:</p>
            <p className='text-2xl uppercase text-white font-roboto'>{user.name}</p>
          </div>
          <div className='flex items-center gap-4'>
            <p className='text-3xl uppercase text-white font-roboto'>Birthdate:</p>
            <p className='text-2xl uppercase text-white font-roboto'>{user.birthdate}</p>
          </div>
          <div className='flex items-center gap-4'>
            <p className='text-3xl uppercase text-white font-roboto'>Gender:</p>
            <p className='text-2xl uppercase text-white font-roboto'>{user.gender}</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-3xl uppercase text-[#EF4A50] font-roboto'>Blood Type:</p>
          <p className='text-2xl uppercase text-white font-roboto'>{user.bloodType}</p>
        </div>
        <div className='grid grid-cols-2 grid-rows-2 gap-4'>
          <div className='flex flex-col col-span-1 row-span-2 items-center justify-center gap-8 bg-[#777777] rounded-xl p-4'>
            <div className='flex items-center gap-4 w-full px-4'>
              <Image
                src="/record_1.png"
                alt="Medical record 1"
                width={152}
                height={152}
                className="w-16 h-16 object-contain"
              />
              <p className='text-xl text-black font-roboto font-semibold w-2/3 text-center'>Past Medical History</p>
            </div>
            <ul className='list-disc text-black font-roboto font-semibold text-xl'>
              <li>Adaptative Microgravity Syndrome</li>
              <li>Shellfish allergy</li>
            </ul>
          </div>
          <div className='flex items-center justify-center gap-2 bg-[#777777] rounded-xl p-4'>
            <Image
              src="/record_3.png"
              alt="Medical record 3"
              width={152}
              height={152}
              className="w-24 h-24 object-contain"
            />
            <p className='text-xl text-black font-roboto font-semibold w-2/3 text-center'>Medical History</p>
          </div>
          <div className='flex items-center gap-2 justify-center bg-[#777777] rounded-xl p-4'>
            <Image
              src="/record_2.png"
              alt="Medical record 2"
              width={152}
              height={152}
              className="w-24 h-24 object-contain"
            />
            <p className='text-xl text-black font-roboto font-semibold w-2/3 text-center'>Exams and Blood works</p>
          </div>
        </div>
      </div>
    </div>
  );
};