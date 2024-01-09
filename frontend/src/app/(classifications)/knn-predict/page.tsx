"use client";

import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const KnnPredictPage = () => {
  const [dataTable, setDataTable] = useState<any>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          setDataTable(results.data);
        },
      });
    } else {
      event.target.value = "";

      toast({
        variant: "destructive",
        title: "Choosing File",
        description: "File must be endswith .csv.",
      });
    }
  };

  const handleResetData = () => {
    setDataTable(undefined);
  };

  // const {} = useMutation({
  //   mutationKey: ["predict-data"],
  //   mutationFn: () => {},
  // });

  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-xl font-semibold">K-Nearest Neighbors</h2>

      <div className="flex items-center gap-x-2">
        <Button asChild>
          <div>
            <Label htmlFor="file-predict" className="capitalize">
              Choose predict file here
            </Label>
            <Input
              id="file-predict"
              type="file"
              onChange={handleFileChange}
              className="hidden rounded-xl"
              accept=".csv"
            />
          </div>
        </Button>
        <Button asChild variant="destructive" onClick={handleResetData}>
          <div className="flex items-center gap-x-2">
            <Trash className="h-4 w-4" />
            Reset Data
          </div>
        </Button>
      </div>
      <div>
        {dataTable && (
          <div className="my-4 flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold ">Choose Options</h2>
            <div>
              <h2 className="text-lg font-medium capitalize">
                distance calculation formula
              </h2>
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl">
        {dataTable ? (
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                {Object.keys(dataTable[0]).map((col, index) => (
                  <TableHead key={index} className="text-center">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataTable.map((row: Array<any>, index: number) => {
                const value = Object.values(row) as [];
                return (
                  <TableRow key={index}>
                    {value.map((value, index) => {
                      return (
                        <TableCell key={index} className="text-center">
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : null}
      </div>
    </div>
  );
};

export default KnnPredictPage;
