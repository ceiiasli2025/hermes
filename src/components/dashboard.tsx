import { FC } from 'react';
import { data } from '@/lib/data-mock';
import Image from 'next/image';
import UserCard from './user-card';
import { useStatus } from '@/context/status';

const Dashboard: FC = () => {
  const { criticalStatus } = useStatus();
  return (
    <div className='p-8 grid grid-cols-4 grid-rows-2 gap-x-8 gap-y-16'>
      {[...data.slice(0, 3),
      { id: 'contact-all', contactAll: true },
      ...data.slice(3)
      ].map((user: any) =>
      user.contactAll ? (
        <div key="contact-all" className='flex-1 flex flex-col items-center justify-center p-4 rounded-xl gap-4 bg-[#151618]'>
          <Image
            src="/icons/phone.png"
            alt="Contact all icon"
            width={64}
            height={64}
            className="inline-block w-[80%] object-contain !aspect-square"
          />
          <p className='uppercase text-[#9FA8AF] font-bold font-roboto text-2xl'>Call all</p>
        </div>
      ) : (
        <UserCard
          key={user.id}
          id={user.id}
          name={user.name}
          nickname={user.nickname}
          img={user.img}
          location={
            criticalStatus
              ? user.id === 7
                ? 'Laboratory'
                : user.id === 5
                  ? 'EVA1'
                  : user.id === 6
                    ? 'EVA2'
                    : user.location
              : user.location
          }
          status={criticalStatus && user.id === 5 ? "critical" : "ok"}
        />
      )
      )}
    </div>
  );
};

export default Dashboard;