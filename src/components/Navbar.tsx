"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between w-full py-4 px-8 border-b bg-white">
      <div className="flex items-center gap-2">
        <span 
          className="font-black text-xl cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => router.push('/dashboard')}
        >
          Warkop
        </span>
      </div>
    </nav>
  );
} 