'use client';
import { ReactNode, FC, useState } from "react";
import Image from "next/image";

interface NavbarProps {
  children?: ReactNode;
  navigation?: boolean;
}

export const Navbar: FC<NavbarProps> = ({ children, navigation = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="px-8 py-4 h-32 flex items-center justify-between gap-4">
      {children}
      <div className="flex items-center justify-between">
        <p className="font-roboto font-medium text-[#929397] text-4xl">
          {new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
      {navigation && (
        <>
          <button
            className="p-4 rounded-xl w-24 h-24"
            onClick={() => setSidebarOpen(true)}
          >
            <Image
              src="/icons/menu.png"
              alt="Menu icon"
              width={32}
              height={32}
              className="inline-block w-10"
            />
          </button>
          {sidebarOpen && (
            <div className="fixed flex flex-col top-0 right-0 h-full w-[456px] bg-[#1C1D1F] shadow-lg z-50 transition-transform duration-300">
              <button
                className="absolute top-4 left-4 cursor-pointer"
                onClick={() => setSidebarOpen(false)}
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
              <Image
                src="/logo_icon.png"
                alt="Hermes Logo"
                width={64}
                height={64}
                className="inline-block w-48 h-48 mt-16 mx-auto"
              />
              <ul className="flex flex-col items-start gap-16 mt-8 px-8">
                <li className="hover:text-[#87868B] font-roboto font-extrabold text-4xl uppercase cursor-pointer text-white flex items-center gap-4">
                  <Image
                    src='/overview.png'
                    alt="Overview icon"
                    width={64}
                    height={64}
                    className="inline-block w-20 h-20"
                  />
                  Overview
                </li>
                <li className="hover:text-[#87868B] font-roboto font-extrabold text-4xl uppercase cursor-pointer text-white flex items-center gap-4">
                  <Image
                    src='/history.png'
                    alt="History icon"
                    width={64}
                    height={64}
                    className="inline-block w-20 h-20"
                  />
                  History
                </li>
                <li className="hover:text-[#87868B] font-roboto font-extrabold text-4xl uppercase cursor-pointer text-white flex items-center gap-4">
                  <Image
                    src='/settings.png'
                    alt="Settings icon"
                    width={64}
                    height={64}
                    className="inline-block w-20 h-20"
                  />
                  Settings
                </li>
                <li className="hover:text-[#87868B] font-roboto font-extrabold text-4xl uppercase cursor-pointer text-white flex items-center gap-4">
                  <Image
                    src='/support.png'
                    alt="Support icon"
                    width={64}
                    height={64}
                    className="inline-block w-20 h-20"
                  />
                    Support
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </nav>
  );
}