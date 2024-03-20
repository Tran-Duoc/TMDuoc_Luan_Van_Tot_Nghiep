import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

const ExerciseCreateButton = () => {
  const param = useParams();
  const navigate = useNavigate();
  const handleRedirectToCreateExercisePage = () => {
    navigate(`/class-detail/create-exercise/${param.id}`);
  };

  return (
    <Button
      className='py-6 w-full'
      variant='default'
      size='lg'
      onClick={handleRedirectToCreateExercisePage}
    >
      Create Exercise
    </Button>
  );
};

export default ExerciseCreateButton;
