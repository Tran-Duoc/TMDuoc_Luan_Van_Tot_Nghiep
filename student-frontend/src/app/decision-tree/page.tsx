"use client";
import React from "react";
import csvParser from "csv-parser";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { FileArchiveIcon, LoaderIcon } from "lucide-react";
import { SelectValues, TableData } from "@/components/common";
import { cn, parseCSV } from "@/lib/utils";
import { useImmer } from "use-immer";
import { Button } from "@/components/ui/button";
import { checkTypeInArray } from "../k-nearest-neighbor/page";
import {
  DECISION_TREE_PREDICTION,
  DecisionTreeType,
} from "@/apis/decision-tree";
import { DiagramWrapper, SelectionInspector } from "@/components/sections";

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
    var tree = data["message"];
    var linkDataArray = [];

    // Debug: log first node
    if (tree && tree.length > 0) {
      console.log("First node from backend:", tree[0]);
      const leafNodes = tree.filter((n: any) => n.label !== null);
      if (leafNodes.length > 0) {
        console.log("First leaf node:", leafNodes[0]);
      }
    }

    for (let i = 0; i < tree.length; i++) {
      if (tree[i]["label"] !== null) {
        // Nút lá - hiển thị label và thông tin samples
        const samples = tree[i]["samples"] || 0;
        const labelCounts = tree[i]["label_counts"] || {};
        const label = tree[i]["label"];

        // Debug log
        console.log(`Leaf ${i}:`, { label, samples, labelCounts });

        // Tính tổng số mẫu và tạo text hiển thị
        const totalSamples =
          Object.values(labelCounts).reduce((a: any, b: any) => a + b, 0) ||
          samples;
        const labelCount = labelCounts[label] || samples;
        const percentage =
          totalSamples > 0
            ? ((labelCount / totalSamples) * 100).toFixed(0)
            : "100";

        console.log(
          `  -> Display: ${label}, ${percentage}%, ${labelCount}/${totalSamples}`
        );

        nodeDataArray.push({
          key: i,
          text: `${label}\n${percentage}%, ${labelCount}/${totalSamples}`,
          category: "leaf",
        });
      } else {
        nodeDataArray.push({
          key: tree[i]["split_attribute"],
          text: tree[i]["split_attribute"],
          category: "decision",
        });
      }
    }
    for (let i = 1; i < tree.length; i++) {
      if (tree[i]["label"] !== null) {
        linkDataArray.push({
          from: tree[i]["parent"],
          to: i,
          visible: true,
          label: tree[i]["order"],
        });
      } else {
        linkDataArray.push({
          from: tree[i]["parent"],
          to: tree[i]["split_attribute"],
          visible: true,
          label: tree[i]["order"],
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
        const firstData = text.split("\n");
        const convertData = firstData[1].split(",");

        const typeOfValue = checkTypeInArray(
          convertData.splice(0, convertData.length - 1)
        );
        if (typeOfValue.length === 0) {
          setArrValue("empty");
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
        console.log("Full response:", response);
        console.log("Response data:", response.data);

        const { data } = response;

        // Save to window for debugging
        (window as any).lastDecisionTreeResponse = data;

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
    <div className="flex flex-col gap-y-2">
      <h2 className="uppercase text-2xl text-blue-500 py-2 font-semibold">
        DECISION TREE
      </h2>
      <div className="p-4 bg-yellow-400/40 text-yellow-700 rounded-2xl">
        <span className="text-xl font-semibold">Note</span>
        <p>1. The label of the Decision Tree must be end of col csv file</p>
      </div>
      <Label className="text-white px-2 py-2 rounded-xl" form="upload-file-csv">
        <div className="flex items-center space-x-2 bg-blue-500 p-2 rounded-xl ">
          <FileArchiveIcon className="w-6 h-6" />
          <span>
            {fileData ? fileData.name + " " + fileData.size : "Choose a file"}
          </span>
          <Input
            type="file"
            className="hidden"
            id="Label"
            accept=".csv"
            onChange={handleOnFileChange}
          />
        </div>
      </Label>
      <div className="w-full">{csvData && <TableData data={csvData} />}</div>
      <div>
        <SelectValues setSelect={setValue} />
      </div>
      <div>
        {fileData && value && (
          <Button disabled={loading} onClick={handlePredict}>
            {loading && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            Send
          </Button>
        )}
      </div>

      <div className="p-2 mt-14">
        {!loading && (
          <div className="grid grid-cols-2 h-[75vh] gap-x-2">
            <div className="h-full overflow-y-auto border-2 p-4 bg-gray-50">
              {stepCalc.length > 0
                ? stepCalc.map((step: any, index) => {
                    // Kiểm tra loại step để styling khác nhau
                    const isBuoc = step.includes("BƯỚC");
                    const isChon = step.includes("Chọn thuộc tính");
                    const isSeparator = step.includes("===");
                    const isEmpty = step.trim() === "";
                    const isLabelInfo = step.includes("Phân bố label");
                    const isLabelEntropy =
                      step.includes("Entropy của label:") ||
                      step.includes("Gini Index của label:");
                    const isIndented = step.startsWith("  -");

                    if (isEmpty) {
                      return <div key={index} className="h-2" />;
                    }

                    if (isSeparator) {
                      return (
                        <hr key={index} className="my-4 border-gray-300" />
                      );
                    }

                    return (
                      <p
                        key={index}
                        className={cn("px-3 py-1", {
                          "text-xl font-bold py-3 bg-blue-500 text-white rounded-md mb-2":
                            isBuoc,
                          "text-lg font-semibold text-green-700 bg-green-100 py-2 px-3 rounded-md":
                            isChon,
                          "text-base font-semibold text-purple-700":
                            isLabelInfo,
                          "text-base font-bold text-purple-900 bg-purple-50 py-2 px-3 rounded":
                            isLabelEntropy,
                          "text-sm pl-8 text-gray-700": isIndented,
                          "text-base":
                            !isBuoc &&
                            !isChon &&
                            !isLabelInfo &&
                            !isLabelEntropy &&
                            !isIndented,
                        })}
                      >
                        {step}
                      </p>
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
