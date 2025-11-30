import numpy as np
from collections import Counter

class DecisionTreeGiniIndex:
    def __init__(self, attribute_name_dict, continuous_attributes):
        self.buoc = 1
        self.attribute_name_dict = attribute_name_dict
        self.step = []
        self.continuous_attributes = continuous_attributes
        self.test_case = {}
        self.test = {}

    class Node:
        def __init__(self, attribute=None, threshold=None, label=None, samples=0, label_counts=None):
            self.attribute = attribute  # Thuộc tính của nút
            self.threshold = threshold  # Ngưỡng (nếu thuộc tính liên tục)
            self.label = label  # Nhãn của nút (nếu là lá)
            self.children = {}  # Các nút con
            self.samples = samples  # Tổng số mẫu tại nút này
            self.label_counts = label_counts or {}  # Số lượng mỗi nhãn

        def add_child(self, value, node):
            self.children[value] = node

        def predict(self, sample):
            if self.label is not None:
                return self.label

            attribute_value = sample[self.attribute]

            if self.attribute in self.continuous_attributes:
                if attribute_value <= self.threshold:
                    child_node = self.children["<="]
                else:
                    child_node = self.children[">"]
            else:
                child_node = self.children[attribute_value]

            return child_node.predict(sample)

    def gini_index(self, y, value, pr=True, threshold=None):
        counter = Counter(y)
        probabilities = [count / len(y) for count in counter.values()]
        gini_index = 1 - sum(p * p for p in probabilities)
        if pr:
            if threshold is None:
                detail_stepp = "Gini Index " + str(value) + ": " + str(round(gini_index, 2))
                self.step.append(detail_stepp)
            else:
                detail_stepp = "Gini Index " + str(value) + " " + str(threshold) + " :" + str(round(gini_index, 2))
                self.step.append(detail_stepp)
        return gini_index

    def information_gain(self, X, y, attribute, threshold=None):
        if threshold is None:
            values = set(X[:, attribute])
        else:
            values = {"<=", ">"}

        subset_gini = 0
        # Tính Gini Index cho từng giá trị của thuộc tính
        for value in values:
            if threshold is None:
                subset_indices = X[:, attribute] == value
            else:
                if value == "<=":
                    subset_indices = X[:, attribute] <= threshold
                else:
                    subset_indices = X[:, attribute] > threshold

            subset_y = y[subset_indices]
            if len(subset_y) > 0:
                # Tính Gini Index cho subset này và hiển thị
                value_gini = self.gini_index(subset_y, value, pr=True, threshold=threshold)
                subset_gini += (len(subset_y) / len(y)) * value_gini

        # Hiển thị Gini Index tổng của thuộc tính
        step_b = "Gini Index của thuộc tính " + self.attribute_name_dict.get(attribute) + ": " + str(round(subset_gini, 2))
        self.step.append(step_b)
        self.step.append("")  # Dòng trống

        return subset_gini

    def choose_best_attribute(self, X, y, used_attributes):
        attrs = ""
        for attribute in range(X.shape[1]):
            if attribute not in used_attributes:
                attrs += str(self.attribute_name_dict.get(attribute))
                attrs += " "
        
        step_buoc = "BƯỚC " + str(self.buoc)
        step_gini = "Tính Gini Index cho các thuộc tính: " + str(attrs)
        self.step.append(step_buoc)
        self.step.append(step_gini)
        self.step.append("")  # Dòng trống
        
        # Tính Gini Index cho tập nhãn ban đầu
        total_gini = self.gini_index(y, "tổng", pr=False)
        step_total_gini = "Gini Index tổng của tập dữ liệu: " + str(round(total_gini, 2))
        self.step.append(step_total_gini)
        self.step.append("")  # Dòng trống
        
        best_gain = 1
        best_attribute = None
        best_threshold = None

        for attribute in range(X.shape[1]):
            if attribute not in used_attributes:
                step_att = "Tính Gini Index cho thuộc tính " + str(self.attribute_name_dict.get(attribute))
                self.step.append(step_att)
                self.step.append("")  # Dòng trống
                
                if attribute in self.continuous_attributes:
                    values = set(X[:, attribute])
                    for value in values:
                        gain = self.information_gain(X, y, attribute, threshold=value)
                        if gain < best_gain:
                            best_gain = gain
                            best_attribute = attribute
                            best_threshold = value
                else:
                    gain = self.information_gain(X, y, attribute)
                    if gain < best_gain:
                        best_gain = gain
                        best_attribute = attribute
                self.step.append("")  # Dòng trống sau mỗi thuộc tính

        step_best_attribute = "Chọn thuộc tính: " + str(self.attribute_name_dict.get(best_attribute))
        self.step.append(step_best_attribute)
        self.step.append("=" * 50)  # Dòng phân cách giữa các bước
        self.step.append("")  # Dòng trống
        self.test_case.update({"Chọn " : str(self.attribute_name_dict.get(best_attribute))})
        self.test.update({self.buoc : self.test_case})
        self.test_case = {}
        self.buoc += 1
        return best_attribute, best_threshold

    def create_decision_tree(self, X, y, used_attributes=None, value=None):
        if len(set(y)) == 1:
            label_counts = Counter(y)
            return self.Node(label=y[0], samples=len(y), label_counts=dict(label_counts))

        if X.shape[1] == 0 or (used_attributes is not None and len(used_attributes) == X.shape[1]):
            label_counts = Counter(y)
            most_common_label = label_counts.most_common(1)[0][0]
            return self.Node(label=most_common_label, samples=len(y), label_counts=dict(label_counts))

        if used_attributes is None:
            used_attributes = set()

        best_attribute, best_threshold = self.choose_best_attribute(X, y, used_attributes)

        if best_attribute is None:
            label_counts = Counter(y)
            most_common_label = label_counts.most_common(1)[0][0]
            return self.Node(label=most_common_label, samples=len(y), label_counts=dict(label_counts))

        node = self.Node(attribute=best_attribute, threshold=best_threshold, samples=len(y), label_counts=dict(Counter(y)))
        used_attributes.add(best_attribute)

        if best_attribute in self.continuous_attributes:
            for value in {"<=", ">"}:
                if value == "<=":
                    subset_indices = X[:, best_attribute] <= best_threshold
                else:
                    subset_indices = X[:, best_attribute] > best_threshold

                subset_X = X[subset_indices]
                subset_y = y[subset_indices]

                if len(subset_X) == 0:
                    label_counts = Counter(y)
                    most_common_label = label_counts.most_common(1)[0][0]
                    node.add_child(value, self.Node(label=most_common_label, samples=0, label_counts={}))
                else:
                    node.add_child(value, self.create_decision_tree(subset_X, subset_y, used_attributes, value=value))
        else:
            values = set(X[:, best_attribute])
            for value in values:
                subset_indices = X[:, best_attribute] == value
                subset_X = X[subset_indices]
                subset_y = y[subset_indices]

                if len(subset_X) == 0:
                    label_counts = Counter(y)
                    most_common_label = label_counts.most_common(1)[0][0]
                    node.add_child(value, self.Node(label=most_common_label, samples=0, label_counts={}))
                else:
                    node.add_child(value, self.create_decision_tree(subset_X, subset_y, used_attributes, value=value))
        return node

    def predict_samples(self, X, tree):
        return [tree.predict(sample) for sample in X]

    def get_step(self):
        return self.step

    def get_pratice(self):
        return self.test