import { Link } from 'react-router-dom';

interface ClassDetailProps {
  path: string;
  className: string;
}

const ClassDetailLink = ({ path, className }: ClassDetailProps) => {
  return (
    <Link
      to={path}
      className='w-full border-2 rounded-md p-3 hover:bg-slate-200/50 duration-150'
    >
      {className}
    </Link>
  );
};

export default ClassDetailLink;
