'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useModal } from '../../contexts/ModalContext';

const Navbar = () => {
  const { openModal } = useModal();
  
  return (
    <nav>
      <div className="flex justify-between items-center py-4 px-8">
        <Link href="/">
          <Image src="./ClearMetrics.svg" width={150} height={150} alt="logo" />
        </Link>
        <div className="flex gap-6 items-center">
          <ul className="flex gap-4">
            <Link href="/">
              <li className="font-medium">Overview</li>
            </Link>
            <Link href="/">
              <li className="font-medium">Detailed Reports</li>
            </Link>
          </ul>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            onClick={openModal}
          >
            Run Analytics
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;