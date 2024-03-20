const TitleBar = ({ title }: { title: string }) => {
  return (
    <div className='w-full h-[15rem]  rounded-xl relative overflow-hidden'>
      <div className='w-full h-full bg-[url("/images/img_learnlanguage.jpg")] bg-no-repeat absolute top-0 left-0 bg-cover'>
        <div className='bg-gradient-to-br from-blue-400 via-transparent to-transparent h-96 w-full rounded-tl-full'></div>
      </div>
      <div className='absolute z-10 bottom-0 left-0 right-0  px-4 py-[1.5rem] text-white'>
        <h1
          className='text-[2.25rem] font-medium leading-[2.75rem] line-clamp-1'
          title={title}
        >
          {title}
        </h1>
      </div>
    </div>
  );
};

export default TitleBar;
