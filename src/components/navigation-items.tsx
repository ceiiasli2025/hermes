import Link from 'next/link';
import Image from 'next/image';

export default function NavigationItems() {
  return (
    <>
      <Link href="/overview" className='transparent p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 cursor-pointer'>
        <Image
          src="/astronaut.png"
          alt="Astronaut icon"
          width={64}
          height={64}
          className="inline-block w-16 h-16"
        />
      </Link>
      <Link
        href={"/base"}
        className='transparent p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 cursor-pointer'
      >
        <Image
          src="/base.png"
          alt="Base icon"
          width={64}
          height={64}
          className="inline-block w-16 h-16"
        />
      </Link>
      <Link
        href={"/zenith"}
        className='transparent p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 cursor-pointer'
      >
        <Image
          src="/zenith.png"
          alt="Zenith icon"
          width={64}
          height={64}
          className="inline-block w-16 h-16"
        />
      </Link>
      <Link
        href={"/construction"}
        className='transparent p-4 rounded-xl bg-[#151618] hover:bg-[#151618]/60 cursor-pointer'
      >
        <Image
          src="/construction.png"
          alt="Construction icon"
          width={64}
          height={64}
          className="inline-block w-16 h-16"
        />
      </Link>
    </>
  );
}