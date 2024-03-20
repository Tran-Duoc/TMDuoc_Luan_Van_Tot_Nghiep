interface ExerciseDetailLayoutProps {
  children: React.ReactNode;
}

const ExerciseDetailLayout = ({ children }: ExerciseDetailLayoutProps) => {
  return <div className='flex flex-col'>{children}</div>;
};

export default ExerciseDetailLayout;
