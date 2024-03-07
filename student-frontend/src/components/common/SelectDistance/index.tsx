import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectDistanceProps {
  setSelect: React.Dispatch<React.SetStateAction<string | null>>;
}

export function SelectDistance({ setSelect }: SelectDistanceProps) {
  return (
    <Select
      onValueChange={(val) => {
        setSelect(val);
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select a Distance' />
      </SelectTrigger>
      <SelectContent position='item-aligned'>
        <SelectGroup>
          <SelectLabel>Distance</SelectLabel>
          <SelectItem value='manhattan'>Manhattan Distance</SelectItem>
          <SelectItem value='euclidean'>Euclid Distance</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
