import '../InspectorRow/Inspector.css';
import { InspectorRow } from '../InspectorRow/index';

interface SelectionInspectorProps {
  selectedData: any;
  onInputChange: (id: string, value: string, isBlur: boolean) => void;
}

export function SelectionInspector(props: SelectionInspectorProps) {
  const renderObjectDetails = () => {
    const selObj = props.selectedData;
    const dets = [];
    for (const k in selObj) {
      const val = selObj[k];
      const row = (
        <InspectorRow
          key={k}
          id={k}
          value={val}
          onInputChange={props.onInputChange}
        />
      );
      if (k === 'key') {
        dets.unshift(row); // key always at start
      } else {
        dets.push(row);
      }
    }
    return dets;
  };

  return (
    <div id='myInspectorDiv' className='inspector'>
      <table>
        <tbody>{renderObjectDetails()}</tbody>
      </table>
    </div>
  );
}
