from fastapi import FastAPI, UploadFile, Form,   HTTPException
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
import numpy as np
from dt_entropy import DecisionTreeC45Entropy
from dt_gini import DecisionTreeGiniIndex 
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
    

def distance_continues(point1, point2, distance_type):
    if distance_type == 'manhattan':
        return round(np.abs(point1 - point2).sum(), 2)
    elif distance_type == 'euclidean':
        return round(np.sqrt(((point1 - point2) ** 2).sum()), 2)
    else:
        raise ValueError("Invalid distance type. Choose 'manhattan' or 'euclidean'.")


@app.post("/knn-prediction")
async def predict_knn(file: Annotated[UploadFile, Form()], distance_calculation: Annotated[str, Form()], k_nearest: Annotated[str, Form()]):
    try:
        k_nearest = int(k_nearest)
        df = pd.read_csv(file.file)
        # Lấy dòng cuối cùng để dự đoán
        last_row = df.iloc[-1, :-1]  # Loại bỏ cột cuối cùng
        distances = {}
        print(distance_calculation)
        for index, row in df.iloc[:-1, :-1].iterrows():  # Lặp qua tất cả các dòng trừ dòng cuối cùng và cột cuối cùng
            distance = distance_continues(row, last_row, distance_calculation)
            distances[index] = float(distance)  


             # Sort distances dictionary by values (distances) and get top k entries
        k_nearest_distances = dict(sorted(distances.items(), key=lambda item: item[1])[:k_nearest])

        # Extract labels for the k-nearest distances
        k_nearest_labels = {index: df.iloc[index, -1] for index in k_nearest_distances.keys()}
        print(distances)

        merged_results = {}
        for key in k_nearest_distances.keys():
            merged_results[key] = {
                "distance": k_nearest_distances[key],
                "label": k_nearest_labels.get(key)
            }

        return {
            "data": distances,
            "merged_results": merged_results
        }   
    except Exception as e:
        return HTTPException(detail=str(e), status_code=500)
    


def calculate_distance(row, last_row):
    p = len(row)
    m = sum(row == last_row)
    return (p - m) / p



@app.post("/knn-prediction-nominal")
async def predict_knn_nominal(file: Annotated[UploadFile, Form()],   k_nearest: Annotated[str, Form()]):
    try:
        k_nearest = int(k_nearest)  
        df = pd.read_csv(file.file)
        # Lấy dòng cuối cùng để dự đoán
        last_row = df.iloc[-1, :-1]  # Loại bỏ cột cuối cùng
        print(df)
         # Tính toán khoảng cách và lưu trữ kết quả
        distances = {}
     
        for index, row in df.iloc[:-1, :-1].iterrows():  # Lặp qua tất cả các dòng trừ dòng cuối cùng và cột cuối cùng
            
            distance = calculate_distance(row, last_row)
            print(distance)
            distances[index] = distance
       
         # Sort distances dictionary by values (distances) and get top k entries
        k_nearest_distances = dict(sorted(distances.items(), key=lambda item: item[1])[:k_nearest])

        # Extract labels for the k-nearest distances
        k_nearest_labels = {index: df.iloc[index, -1] for index in k_nearest_distances.keys()}

        merged_results = {}
        for key in k_nearest_distances.keys():
            merged_results[key] = {
                "distance": k_nearest_distances[key],
                "label": k_nearest_labels.get(key)
            }

        return  {
            "data": distances,
            "merged_results": merged_results

        }
    except Exception as e:
        return HTTPException(detail=str(e), status_code=500)
    

# @app.post("/knn-prediction-mixing")
# def prediction_mixing(file: Annotated[UploadFile, Form()],   k_nearest: Annotated[str, Form()]):
#     return 
# def calculate_label_probabilities(df, label_column=-1):
#     label_counts = df.iloc[:, label_column].value_counts()
#     total_samples = len(df)
#     label_probabilities = {}
#     for label, count in label_counts.items():
#         label_probabilities[label] = {
#             "probabilities": count / total_samples
#         }
#     return label_probabilities

def calculate_probabilities(df: pd.DataFrame, target: str):
    # Tạo một từ điển để lưu trữ xác suất của từng nhãn
    probabilities = {}
    
    # Lấy tên cột cuối cùng
    last_column_name = df.columns[-1]
    
    # Lấy các giá trị duy nhất của nhãn
    unique_labels = df[last_column_name].unique()
        
    # Tính xác suất tổng hợp của X với Laplace correction
    p_x = 1
    for label in unique_labels:
        label_data = df[df.iloc[:, -1] == label]
        p_x_given_label = 1
        for feature in target.split():
            count = (label_data.iloc[:, :-1] == feature).sum().sum() + 1  # Laplace correction
            p_x_given_label *= count / (len(label_data) + len(df.iloc[:, :-1].columns))
        p_label = len(label_data) / len(df)
        p_x += p_x_given_label * p_label

    # Tính xác suất của mỗi nhãn dựa trên xác suất tổng hợp của X
    for label in unique_labels:
        label_data = df[df.iloc[:, -1] == label]
        p_label_given_x = 0
        p_x_given_label = 1
        for feature in target.split():
            count = (label_data.iloc[:, :-1] == feature).sum().sum() + 1  # Laplace correction
            p_x_given_label *= count / (len(label_data) + len(df.iloc[:, :-1].columns))
        p_label = len(label_data) / len(df)
        p_label_given_x = (p_x_given_label * p_label) / p_x
        probabilities[label] = p_label_given_x

    print(p_x)
    return probabilities



@app.post("/naive_bayes")
async def naive_bayes(file: Annotated[UploadFile, Form()],):
    try:
        # Đọc dữ liệu từ tệp CSV
        df = pd.read_csv(file.file)
        # Loại bỏ dòng đầu tiên chứa tên các giá trị
        
        # Loại bỏ dòng cuối cùng với giá trị cuối cùng là dấu "?"
        df = df.iloc[:-1]
        print(df)

        # Lấy dòng dữ liệu cuối cùng làm target
        target = df.iloc[-1, :-1].values
     
     
        # Tính toán xác suất của từng nhãn
        probabilities = calculate_probabilities(df, " ".join(target))
        
        # Tính xác suất tổng hợp
        total_probability = sum(probabilities.values())
        
        # Tính xác suất của từng nhãn dựa trên tổng hợp
        label_results = {label: prob / total_probability for label, prob in probabilities.items()}
        
        return  JSONResponse(label_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")
    

 