import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div>
      <ul className="flex justify-between m-10 item-center">
        <div>
            <Link href="/">
                <li>
                    首頁
                </li>
            </Link>
        </div>
        <div className="flex gap-10">
            <Link href="/dashboard">
                <li>
                    後台
                </li>
            </Link>
            <Link href="/login">
                <li>
                    登入
                </li>
            </Link>
            <Link href="/register">
                <li>
                    註冊
                </li>
            </Link>   
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
