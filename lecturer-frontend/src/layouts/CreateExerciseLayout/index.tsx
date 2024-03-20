import { Header } from '@/components/sections';

interface CreateExerciseLayoutProps {
  children: React.ReactNode;
}

const CreateExerciseLayout = ({ children }: CreateExerciseLayoutProps) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default CreateExerciseLayout;
