import { useEffect, useState } from 'react';

import { Button } from '../components/shared/utilities/form';
import { NoneLayout } from '../layouts/none-layout/none-layout';

export default function Page() {

  return (
    <div className="flex flex-col justify-center min-h-screen p-4 bg-white">
      <img
        src="/assets/imgs/logo.png"
        className="object-cover w-48 mx-auto my-0 mt-10"
        alt="logo"
      />
      <img
        src="/assets/imgs/icon-success.png"
        className="object-cover w-48 mx-auto my-0 mt-10"
        alt="logo"
      />
      <div className="px-8 my-8 text-xl font-semibold text-center uppercase">
        thay đổi mật khẩu thành công!
      </div>
      <Button text="Về trang đăng nhập" primary className='w-full h-12 my-5' href="/login" />

    </div>
  )
}

Page.Layout = NoneLayout;
