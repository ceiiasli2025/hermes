import Image from 'next/image';
export default function ConstructionPage() {
  return (
    <div className="flex h-full w-full items-start justify-center bg-[#010C24]">
      <Image
        src="/construction-bg.png"
        alt="Under Construction"
        width={1900}
        height={1070}
        className="w-full h-full object-contain"
      />
    </div>
  );
}