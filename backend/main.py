from fastapi import FastAPI, UploadFile, Form, File, HTTPException
import pandas as pd
import json
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
import numpy as np
from dt_entropy import DecisionTreeC45Entropy
from dt_gini import DecisionTreeGiniIndex
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from fastapi.responses import JSONResponse

pd.options.mode.chained_assignment = None 

def decision_tree_to_dict(node, attribute_mapping, parent=None, th=None):
    node_dict = {}

    # Thêm thuộc tính attribute và tên thuộc tính (attribute_name)
    if node.attribute is not None:
        attribute_name = attribute_mapping.get(node.attribute)
        node_dict["attribute"] = attribute_name
    else:
        node_dict["attribute"] = None

    # Thêm thuộc tính value
    if parent is not None:
        for value, child_node in parent.children.items():
            if child_node == node:
                node_dict["value"] = value
                break
    else:
        node_dict["value"] = None

    node_dict["threshold"] = th

    # Thêm thuộc tính parent (tên của nút cha)
    if parent is not None:
        node_dict["parent"] = parent.attribute
    else:
        node_dict["parent"] = None

    # Thêm thuộc tính label
    node_dict["label"] = node.label

    # Tạo danh sách các nút con
    children = []
    for child_node in node.children.values():
        if node.attribute in continuous_attributes:
            child_dict = decision_tree_to_dict(child_node, attribute_mapping, parent=node, th=node.threshold)
            children.append(child_dict)
        else: 
            child_dict = decision_tree_to_dict(child_node, attribute_mapping, parent=node, th=None)
            children.append(child_dict)

    node_dict["children"] = children

    return node_dict


def predict_samples(X, tree):
    return [tree.predict(sample) for sample in X]

def convert_numpy_int64_to_int(x):
  """
  Chuyển đổi đối tượng numpy.int64 thành int

  Args:
    x: Đối tượng numpy.int64

  Returns:
    Đối tượng int
  """

  if isinstance(x, np.int64):
    return int(x)
  else:
    return x

class NodeJson:
    def __init__(self, split_attribute, label, order, parent):
        self.split_attribute=split_attribute
        self.label=label
        self.order=order
        self.parent=parent
    def print_info(self):
        print(type(self.order))
        print(type(self.label))
        print(type(self.parent))
        print(type(self.split_attribute))


app = FastAPI()
origins = ["*"]  # Thay đổi thành danh sách các nguồn bạn muốn cho phép truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def add_to_arr(arr, json_tree):
    stack = [(json_tree, None)]  # Sử dụng stack thay vì đệ quy
    while stack:
        node, parent = stack.pop()
        order = node['value']
        if node['threshold'] != None:
            order = str(order) + str(node['threshold'])
        arr.append(NodeJson(convert_numpy_int64_to_int(node['attribute']), 
                            convert_numpy_int64_to_int(node['label']), 
                            convert_numpy_int64_to_int(order), 
                            parent=convert_numpy_int64_to_int(parent)))
        for child in reversed(node['children']):  # Đảo ngược thứ tự để duyệt theo thứ tự đúng
            stack.append((child, node['attribute']))


@app.post("/decision-tree-c45")
async def decision_tree_c45(file: Annotated[UploadFile, Form()], conti_attribute: Annotated[str, Form()], type: Annotated[str, Form()]):

    if file is None:
        return {"message": "No file received"}
    # Read the CSV file into a DataFrame
    # print(conti_attribute)
    # print(file.filename)
    try:
        global continuous_attributes
        if conti_attribute == 'empty':
            continuous_attributes = set()
        else:
            continuous_attributes = [int(num) for num in conti_attribute.split(",")]
        # print(continuous_attributes)
        data = pd.read_csv(file.file)
        # print(data.head())
        attribute_name = data.columns.values.tolist()
        attribute_name_dict = {}
        for i in range(len(attribute_name) - 1):
            attribute_name_dict.update({i: attribute_name[i]})
        # print(attribute_name_dict)
        # data = data.iloc[1:]

        # Chuyển đổi dữ liệu thành mảng numpy
        data_np = np.array(data)

        # Tách thuộc tính và nhãn
        X = data_np[:, :-1]  # Thuộc tính
        y = data_np[:, -1]  # Nhãn
        # print(type(y[0]))
        # y = y.astype(str)
        if type == 'Entropy':
        # Tạo cây quyết định
            tree = DecisionTreeC45Entropy(attribute_name_dict, continuous_attributes)
            decision_tree = tree.create_decision_tree(X, y)
            decision_tree_dict = decision_tree_to_dict(decision_tree, attribute_name_dict)
            
            arr = []
            add_to_arr(arr,decision_tree_dict)
            steps = tree.get_step()
            return {"message":arr,
                    "steps":steps,
                    "error":"no"}
        else:
            tree = DecisionTreeGiniIndex(attribute_name_dict, continuous_attributes)
            decision_tree = tree.create_decision_tree(X, y)
            decision_tree_dict = decision_tree_to_dict(decision_tree, attribute_name_dict)
            
            arr = []
            add_to_arr(arr,decision_tree_dict)
            steps = tree.get_step()
            # for item in arr:
            #     item.print_info()
            # print(steps)
            # print(decision_tree_dict)
            # print(tree.get_pratice())
            return {"message": arr,
                    "steps":steps,
                    "error":"no"}
    except:
        return {"error":"yes"}
    
import pandas as pd
from sklearn.preprocessing import LabelEncoder

def preprocess_data(data):
    features = data.iloc[:, :-1]
    for column in features.columns:
        if features[column].dtype == 'object':
            label_encoder = LabelEncoder()
            features[column] = label_encoder.fit_transform(features[column])
    preprocessed_data = pd.concat([features, data.iloc[:, -1]], axis=1)
    return preprocessed_data


@app.post("/knn-prediction")
async def predict_knn(file: Annotated[UploadFile, Form()], distance_calculation: Annotated[str, Form()], k_nearest: Annotated[str, Form()]):
    try:
        data = pd.read_csv(file.file)
        # Preprocess the data
        perfect_data = preprocess_data(data)

        print(perfect_data)
        # Convert data to NumPy array
        data_np = np.array(perfect_data)

        if distance_calculation == 'manhattan':
            last_row = data_np[-1, :-1]
            distances = np.sum(np.abs(data_np[:-1, :-1] - last_row), axis=-1)
        elif distance_calculation == 'euclidean':
            last_row = data_np[-1, :-1]
            distances = np.linalg.norm(data_np[:-1, :-1].astype(float) - last_row.astype(float), axis=-1)
            distances = np.round(distances, 3)  
        else:
            pass
        data['distance'] = np.append(distances, 0)
        X = data_np[:, :-1]
        y = data_np[:, -1]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

        knn_model = KNeighborsClassifier(n_neighbors=int(k_nearest), metric=distance_calculation)
        knn_model.fit(X_train, y_train)

        last_row_features = data_np[-1, :-1].reshape(1, -1)
        knn_model.predict(X_test)
        predicted_label =  knn_model.predict(last_row_features)[0]
        dt_response = data.iloc[:-1, :].sort_values(by='distance', ascending=True)


        print(predicted_label)
        print(dt_response.iloc[:-1, :].sort_values(by='distance', ascending=True))
        return    {"file":  dt_response}
    except Exception as e:
        return HTTPException(detail=str(e), status_code=500)