import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import { useState, useCallback } from "react";
import { DiagramData } from "@/app/decision-tree/page";
import { GuidedDraggingTool } from "..";

import "./Diagram.css";

interface DiagramProps {
  diagramData: DiagramData;
}

export function DiagramWrapper(props: DiagramProps) {
  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true,
      draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.ts
      "draggingTool.horizontalGuidelineColor": "blue",
      "draggingTool.verticalGuidelineColor": "blue",
      "draggingTool.centerGuidelineColor": "green",
      "draggingTool.guidelineWidth": 1,
      layout: $(go.TreeLayout, {
        angle: 0, // 0 = horizontal (left to right), 90 = vertical (top to bottom)
        layerSpacing: 100, // khoảng cách giữa các tầng
        nodeSpacing: 50, // khoảng cách giữa các node cùng tầng
        alignment: go.TreeLayout.AlignmentCenterChildren,
        isInitial: false,
        isOngoing: false,
      }),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },

        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape,
        "RoundedRectangle",
        {
          fill: "lightblue",
          portId: "",
          fromLinkable: false,
          toLinkable: false,
          cursor: "pointer",
          minSize: new go.Size(80, 40),
        },
        // Shape.fill is bound to Node.data.color
        new go.Binding("fill", "category", (category) =>
          category === "decision" ? "lightblue" : "lightgreen"
        )
      ),
      $(
        go.TextBlock,
        {
          margin: 8,
          editable: true,
          font: "600 .875rem Roboto, sans-serif",
          textAlign: "center",
          wrap: go.TextBlock.WrapFit,
          maxSize: new go.Size(150, NaN),
        },
        new go.Binding("text").makeTwoWay()
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      new go.Binding("relinkableFrom", "canRelink").ofModel(),
      new go.Binding("relinkableTo", "canRelink").ofModel(),
      $(go.Shape, { strokeWidth: 1.5 }), // đường nối
      $(go.Shape, { toArrow: "Standard", strokeWidth: 1.5 }), // mũi tên
      $(
        go.TextBlock, // label trên cạnh
        {
          segmentOffset: new go.Point(0, -10),
          segmentOrientation: go.Link.OrientUpright,
          font: "500 .875rem Roboto, sans-serif",
          background: "white",
          margin: 3,
        },
        new go.Binding("text", "label")
      )
    );
    return diagram;
  };

  return (
    <ReactDiagram
      divClassName="w-full  h-full border-2"
      initDiagram={initDiagram}
      nodeDataArray={props.diagramData.nodeDataArray}
      linkDataArray={props.diagramData.linkDataArray}
      modelData={props.diagramData.modelData}
      // skipsDiagramUpdate={props.diagramData.skipsDiagramUpdate}
    />
  );
}
