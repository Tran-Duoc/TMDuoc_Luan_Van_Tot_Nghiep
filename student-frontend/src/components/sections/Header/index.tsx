import { Button } from '@/components/ui/button';
import { IDecodeToken, cleanTokenToCookie, decodeToken } from '@/lib/utils';
import { getCookie } from 'cookies-next';
import { JwtPayload } from 'jwt-decode';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const token = getCookie('access_token');
const Header = () => {
  const router = useRouter();
  const authState = Boolean(token);
  const [infoStudent, setInfoStudent] = React.useState<IDecodeToken>({});
  React.useEffect(() => {
    if (authState && token) {
      const student = decodeToken(token as string);
      setInfoStudent(student);
    } else {
      router.push('/login');
    }
  }, [authState, router]);

  const handleLogout = () => {
    cleanTokenToCookie();
    router.push('/login');
  };

  return (
    <div className='flex items-center h-14 border-b px-4 bg-slate-100 fixed left-0 right-0 top-0 z-10 justify-between'>
      <Image
        src='/images/cit.png'
        alt='this is a logo'
        width={50}
        height={50}
      />
      <div className='flex items-center gap-x-2'>
        {authState ? (
          <>
            <p>{infoStudent.student_code}</p>

            <Button variant={'default'} onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button variant={'secondary'}>
              <Link href='/register'>Register</Link>
            </Button>
            <Button>
              <Link href='/login'>Login</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
