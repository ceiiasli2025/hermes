import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type UserCardProps = {
  id: string;
  name: string;
  nickname: string;
  img: string;
  location: string;
  status: 'ok' | 'warning' | 'critical';
};

const UserCard: FC<UserCardProps> = ({ id, name, nickname, img, location, status }) => {
  const [showModal, setShowModal] = useState(false);

  const cardClass = `flex-1 flex flex-col items-center justify-between p-4 rounded-xl gap-4 cursor-pointer aspect-square
    ${status === 'ok' ? 'bg-[#246E10]' : status === 'warning' ? 'bg-[#B77700]' : 'bg-[#A61213]'}`;

  const cardContent = (
    <>
      <p className='uppercase text-white font-medium font-roboto text-4xl'>{nickname}</p>
      <Image
        src={`${img}`}
        alt={`${name}'s avatar`}
        width={256}
        height={256}
        className="rounded-full w-[80%] object-contain !aspect-square scale-200"
      />
      <div className='flex items-center w-full'>
        <Image
          src={`/icons/location.png`}
          alt={`Location icon`}
          width={32}
          height={32}
          className="inline-block w-8 h-8"
        />
        <p className='text-white font-medium font-roboto text-xl uppercase truncate'>{location}</p>
        <Image
          src={`/icons/phone.png`}
          alt={`Phone icon`}
          width={32}
          height={32}
          className="inline-block w-12 h-12 ml-auto"
        />
      </div>
    </>
  );

  return (
    <>
      {status === 'ok' ? (
        <Link href={`/overview/${id}`} className={cardClass}>
          {cardContent}
        </Link>
      ) : (
        <button
          type="button"
          className={cardClass}
          onClick={() => setShowModal(true)}
        >
          {cardContent}
        </button>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div className="bg-[#010101] p-16 rounded-xl flex flex-col justify-center items-center gap-2 relative">
            <p className="text-4xl font-extrabold uppercase text-white">Medical emergency</p>
            <p className="text-2xl font-medium uppercase text-white">{nickname}</p>
            <button
              className='text-white font-extrabold text-2xl absolute top-4 right-4 cursor-pointer'
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <div className='grid grid-cols-2 gap-4 mt-8'>
              <div className='p-4 bg-[#2A2A2D] flex items-center justify-center text-white text-2xl rounded-lg'>
                Move to
                <span className='text-[#FFEA00]'>&nbsp;Yellow</span>
              </div>
              <Link
                href={'/emergency'}
                target='_blank'
                className='p-4 bg-[#2A2A2D] flex items-center justify-center text-white text-2xl rounded-lg cursor-pointer'
                onClick={() => setShowModal(false)}
              >
                Activate
                <span className='text-[#FF0004]'>&nbsp;Emergency&nbsp;</span>
                Protocol
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;