import BeatLoader from 'react-spinners/BeatLoader';

const LoadingFillPage = () => {
  return (
    <div className='h-screen fixed inset-0'>
      <div className='absolute  w-full h-full bg-slate-100/20 blur'></div>
      <div
        className='absolute top-1/2 left-1/2 -translate-x-1/2 text-xl 
      -translate-y-1/2 text-black'
      >
        <BeatLoader color='#36d7b7' />
      </div>
    </div>
  );
};

export default LoadingFillPage;
