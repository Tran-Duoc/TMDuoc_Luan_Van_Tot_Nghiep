'use client';
import React from 'react';
import csvParser from 'csv-parser';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { FileArchiveIcon, LoaderIcon } from 'lucide-react';
import { SelectValues, TableData } from '@/components/common';
import { cn, parseCSV } from '@/lib/utils';
import { useImmer } from 'use-immer';
import { Button } from '@/components/ui/button';
import { checkTypeInArray } from '../k-nearest-neighbor/page';
import {
  DECISION_TREE_PREDICTION,
  DecisionTreeType,
} from '@/apis/decision-tree';
import { DiagramWrapper, SelectionInspector } from '@/components/sections';

export type DiagramData = {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  selectedData: go.ObjectData | null;
  skipsDiagramUpdate: boolean;
};

const DecisionTree = () => {
  const [csvData, setCsvData] = React.useState<Object[] | null>([]);

  const [mapNodeKeyIdx, setMapNodeKeyIdx] = React.useState<Map<go.Key, number>>(
    new Map<go.Key, number>()
  );
  const [mapLinkKeyIdx, setMapLinkKeyIdx] = React.useState<Map<go.Key, number>>(
    new Map<go.Key, number>()
  );

  const [diagram, updateDiagram] = useImmer<DiagramData>({
    nodeDataArray: [],
    linkDataArray: [],
    modelData: {
      canRelink: true,
    },
    selectedData: null,
    skipsDiagramUpdate: false,
  });

  const [inspector, setInspector] = React.useState<JSX.Element>();

  const [value, setValue] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [fileData, setFileData] = React.useState<File | null>(null);

  const [arrValue, setArrValue] = React.useState<any[] | string>([]);

  const [stepCalc, setStepCalc] = React.useState([]);

  const refreshNodeIndex = React.useCallback(
    (nodeArr: Array<go.ObjectData>) => {
      const newMapNodeKeyIdx: Map<go.Key, number> = new Map<go.Key, number>();
      nodeArr.forEach((n: go.ObjectData, idx: number) => {
        newMapNodeKeyIdx.set(n.key, idx);
      });
      setMapNodeKeyIdx(newMapNodeKeyIdx);
    },
    []
  );

  const refreshLinkIndex = React.useCallback(
    (linkArr: Array<go.ObjectData>) => {
      const newMapLinkKeyIdx: Map<go.Key, number> = new Map<go.Key, number>();
      linkArr.forEach((l: go.ObjectData, idx: number) => {
        newMapLinkKeyIdx.set(l.key, idx);
      });
      setMapLinkKeyIdx(newMapLinkKeyIdx);
    },
    []
  );

  React.useEffect(() => {
    refreshNodeIndex(diagram.nodeDataArray);
    refreshLinkIndex(diagram.linkDataArray);
  }, [
    refreshNodeIndex,
    refreshLinkIndex,
    diagram.nodeDataArray,
    diagram.linkDataArray,
  ]);

  function convertDataToTree(data: any) {
    var nodeDataArray = [];
    var tree = data['message'];
    var linkDataArray = [];
    for (let i = 0; i < tree.length; i++) {
      if (tree[i]['label'] !== null) {
        nodeDataArray.push({
          key: i,
          text: tree[i]['label'],
          category: 'leaf',
        });
      } else {
        nodeDataArray.push({
          key: tree[i]['split_attribute'],
          text: tree[i]['split_attribute'],
          category: 'decision',
        });
      }
    }
    for (let i = 1; i < tree.length; i++) {
      if (tree[i]['label'] !== null) {
        linkDataArray.push({
          from: tree[i]['parent'],
          to: i,
          visible: true,
          label: tree[i]['order'],
        });
      } else {
        linkDataArray.push({
          from: tree[i]['parent'],
          to: tree[i]['split_attribute'],
          visible: true,
          label: tree[i]['order'],
        });
      }
    }

    return { nodeDataArray, linkDataArray };
  }

  const handleOnFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileData(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const text = reader.result as string;
        const firstData = text.split('\n');
        const convertData = firstData[1].split(',');

        const typeOfValue = checkTypeInArray(
          convertData.splice(0, convertData.length - 1)
        );
        if (typeOfValue.length === 0) {
          setArrValue('empty');
        } else {
          setArrValue(typeOfValue);
        }

        const parseCSVData = parseCSV(text);
        setCsvData(parseCSVData);
      }
    };
    reader.readAsText(file);
  };

  function generateLoc(index: number) {
    const x = (index % 3) * 100; // Adjust 100 as needed for horizontal spacing
    const y = Math.floor(index / 3) * 100; // Adjust 100 as needed for vertical spacing
    return `${x} ${y}`;
  }

  const handlePredict = async () => {
    const data: DecisionTreeType = {
      file: fileData as File,
      type: value as string,
      conti_attribute: arrValue,
    };

    setLoading(true);
    await DECISION_TREE_PREDICTION(data)
      .then((response) => {
        console.log(response);

        const { data } = response;

        const tree = convertDataToTree(data);

        const nodeDataArrayWithLoc = tree.nodeDataArray.map(
          (node: any, index: number) => ({
            ...node,
            loc: generateLoc(index),
          })
        );

        updateDiagram((draft: DiagramData) => {
          draft.nodeDataArray = nodeDataArrayWithLoc;
          draft.linkDataArray = tree.linkDataArray;
        });

        setStepCalc(data.steps);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='flex flex-col gap-y-2'>
      <h2 className='uppercase text-2xl text-blue-500 py-2 font-semibold'>
        DECISION TREE
      </h2>
      <div className='p-4 bg-yellow-400/40 text-yellow-700 rounded-2xl'>
        <span className='text-xl font-semibold'>Note</span>
        <p>1. The label of the Decision Tree must be end of col csv file</p>
      </div>
      <Label className='text-white px-2 py-2 rounded-xl' form='upload-file-csv'>
        <div className='flex items-center space-x-2 bg-blue-500 p-2 rounded-xl '>
          <FileArchiveIcon className='w-6 h-6' />
          <span>
            {fileData ? fileData.name + ' ' + fileData.size : 'Choose a file'}
          </span>
          <Input
            type='file'
            className='hidden'
            id='Label'
            accept='.csv'
            onChange={handleOnFileChange}
          />
        </div>
      </Label>
      <div className='w-full'>{csvData && <TableData data={csvData} />}</div>
      <div>
        <SelectValues setSelect={setValue} />
      </div>
      <div>
        {fileData && value && (
          <Button disabled={loading} onClick={handlePredict}>
            {loading && <LoaderIcon className='mr-2 h-4 w-4 animate-spin text-muted-foreground' />}
            Send
          </Button>
        )}
      </div>

      <div className='p-2 mt-14'>
        {!loading && (
          <div className='grid grid-cols-2 h-[75vh] gap-x-2'>
            <div className='h-full overflow-y-auto border-2'>
              {stepCalc.length > 0
                ? stepCalc.map((step: any, index) => {
                    return (
                      <span key={index}>
                        <p
                          className={cn('px-2 list-disc', {
                            'text-xl font-semibold py-3 bg-slate-400 text-white':
                              step.includes('Bước'),
                          })}
                        >
                          {step}
                        </p>
                        <br />
                      </span>
                    );
                  })
                : null}
            </div>
            <div>
              <DiagramWrapper diagramData={diagram} />
              {inspector}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionTree;
