from typing import Union
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import os
from pathlib import Path

 

app = FastAPI()

origins = ["http://localhost:3000"]   
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/train")
async def train_model(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)
    print(df)
    return {"message": "Model trained successfully."}

@app.get('/test_api')
def testApi():
    return { "hello" : 'world'}
