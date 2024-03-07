import { Book, AlignStartVerticalIcon, TreeDeciduousIcon } from 'lucide-react';

export const NAV_ITEMS = [
  {
    name: 'Documentation',
    path: '/',
    icon: <Book className='w-4 h-4' />,
  },
  {
    name: 'K-Nearest Neighbor',
    path: '/k-nearest-neighbor',
    icon: <AlignStartVerticalIcon className='w-4 h-4' />,
  },
  {
    name: 'Decision Tree',
    path: '/decision-tree',
    icon: <TreeDeciduousIcon className='w-4 h-4' />,
  },
  {
    name: 'Examination',
    path: '/exam',
    icon: <TreeDeciduousIcon className='w-4 h-4' />,
  },
];
