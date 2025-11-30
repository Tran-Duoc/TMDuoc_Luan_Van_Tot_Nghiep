#!/usr/bin/env python3
"""Test with actual CSV data"""
import sys
import pandas as pd
import numpy as np
from collections import Counter

# Add current directory to path
sys.path.insert(0, '.')

from dt_entropy import DecisionTreeC45Entropy
from main import decision_tree_to_dict, add_to_arr, NodeJson, convert_numpy_int64_to_int

# Read sample data
data = pd.read_csv('../sample-data/decision-tree-discrete.csv')
print("Data shape:", data.shape)
print("Columns:", data.columns.tolist())

# Prepare data
attribute_name = data.columns.values.tolist()
attribute_name_dict = {}
for i in range(len(attribute_name) - 1):
    attribute_name_dict.update({i: attribute_name[i]})

print("\nAttribute mapping:", attribute_name_dict)

# Convert to numpy
data_np = np.array(data)
X = data_np[:, :-1]
y = data_np[:, -1]

print("\nX shape:", X.shape)
print("y shape:", y.shape)
print("Unique labels:", np.unique(y))

# Create tree
continuous_attributes = set()
tree = DecisionTreeC45Entropy(attribute_name_dict, continuous_attributes)
decision_tree = tree.create_decision_tree(X, y)

print("\n=== Root Node ===")
print("Attribute:", decision_tree.attribute)
print("Label:", decision_tree.label)
print("Samples:", decision_tree.samples)
print("Label counts:", decision_tree.label_counts)

# Check children
print("\n=== Children ===")
for key, child in decision_tree.children.items():
    print(f"\nChild '{key}':")
    print(f"  Attribute: {child.attribute}")
    print(f"  Label: {child.label}")
    print(f"  Samples: {child.samples}")
    print(f"  Label counts: {child.label_counts}")

# Convert to dict
decision_tree_dict = decision_tree_to_dict(decision_tree, attribute_name_dict)
print("\n=== Tree Dict (first level) ===")
print("Attribute:", decision_tree_dict.get('attribute'))
print("Label:", decision_tree_dict.get('label'))
print("Samples:", decision_tree_dict.get('samples'))
print("Label counts:", decision_tree_dict.get('label_counts'))

# Convert to array
arr = []
add_to_arr(arr, decision_tree_dict)
print(f"\n=== Array has {len(arr)} nodes ===")

# Check first few nodes
for i, node in enumerate(arr[:3]):
    print(f"\nNode {i}:")
    print(f"  split_attribute: {node.split_attribute}")
    print(f"  label: {node.label}")
    print(f"  samples: {node.samples}")
    print(f"  label_counts: {node.label_counts}")
    
# Convert to dict for JSON
arr_dict = [node.to_dict() for node in arr]
print(f"\n=== First node as dict ===")
print(arr_dict[0])

# Find leaf nodes
leaf_nodes = [node for node in arr_dict if node['label'] is not None]
print(f"\n=== Found {len(leaf_nodes)} leaf nodes ===")
for i, leaf in enumerate(leaf_nodes[:3]):
    print(f"\nLeaf {i}:")
    print(f"  Label: {leaf['label']}")
    print(f"  Samples: {leaf['samples']}")
    print(f"  Label counts: {leaf['label_counts']}")
