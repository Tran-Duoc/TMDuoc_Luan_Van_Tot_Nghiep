#!/usr/bin/env python3
"""Debug Node creation to see if samples and label_counts are preserved"""

# Simulate the Node class
class Node:
    def __init__(self, attribute=None, threshold=None, label=None, samples=0, label_counts=None):
        self.attribute = attribute
        self.threshold = threshold
        self.label = label
        self.children = {}
        self.samples = samples
        self.label_counts = label_counts or {}
        print(f"Created Node: attr={attribute}, label={label}, samples={samples}, label_counts={label_counts}")

# Simulate Counter
class FakeCounter(dict):
    def most_common(self, n):
        return sorted(self.items(), key=lambda x: x[1], reverse=True)[:n]

# Test 1: Create leaf node like in the code
print("=== Test 1: Leaf node creation ===")
y = ['Yes', 'Yes', 'Yes']
# Manually create counter
from collections import Counter
label_counts = Counter(y)
print(f"Counter from y: {dict(label_counts)}")
leaf = Node(label=y[0], samples=len(y), label_counts=dict(label_counts))

# Test 2: Create decision node
print("\n=== Test 2: Decision node creation ===")
y2 = ['Yes', 'Yes', 'No', 'No', 'No']
label_counts2 = Counter(y2)
print(f"Counter from y2: {dict(label_counts2)}")
decision = Node(attribute=0, threshold=None, samples=len(y2), label_counts=dict(label_counts2))

# Test 3: Simulate decision_tree_to_dict
print("\n=== Test 3: Convert to dict ===")
def node_to_dict(node):
    return {
        'attribute': node.attribute,
        'label': node.label,
        'samples': node.samples,
        'label_counts': node.label_counts
    }

leaf_dict = node_to_dict(leaf)
print(f"Leaf dict: {leaf_dict}")

decision_dict = node_to_dict(decision)
print(f"Decision dict: {decision_dict}")

# Test 4: Check if dict preserves data
print("\n=== Test 4: Access from dict ===")
print(f"Leaf samples from dict: {leaf_dict.get('samples')}")
print(f"Leaf label_counts from dict: {leaf_dict.get('label_counts')}")
