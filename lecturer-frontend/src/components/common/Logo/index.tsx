import iconHeader from '/images/cit.png';

const Logo = () => {
  return (
    <>
      <img
        src={iconHeader}
        alt='this is icon header of Machine Learning tool'
        width={40}
        height={40}
      />
      <span className='ml-2 font-medium text-xl'>
        CIT Machine Learning Tool
      </span>
    </>
  );
};

export default Logo;
