'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Intro() {
  const router = useRouter();

  setTimeout(() => {
    router.push("/overview");
  }, 5000);

  return (
    <div className="flex h-screen min-w-screen items-center justify-center">
      <Image
        src="/logo.png"
        alt="Hermes Logo"
        width={320}
        height={320}
        className="animate-pulse min-w-[90vmin] min-h-[90vmin] aspect-square"
      />
    </div>
  );
}