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

interface SelectValueProps {
  setSelect: React.Dispatch<React.SetStateAction<string | null>>;
}

export function SelectValues({ setSelect }: SelectValueProps) {
  return (
    <Select
      onValueChange={(val) => {
        setSelect(val);
      }}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Criterion' />
      </SelectTrigger>
      <SelectContent position='item-aligned'>
        <SelectGroup>
          <SelectLabel>The Value</SelectLabel>
          <SelectItem value='Gini'>Gini</SelectItem>
          <SelectItem value='Entropy'>Entropy</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
