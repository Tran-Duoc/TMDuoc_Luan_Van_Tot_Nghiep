#!/usr/bin/env python3
"""Test script to verify samples and label_counts are working"""

# Simulate what happens in the code
class Node:
    def __init__(self, attribute=None, threshold=None, label=None, samples=0, label_counts=None):
        self.attribute = attribute
        self.threshold = threshold
        self.label = label
        self.children = {}
        self.samples = samples
        self.label_counts = label_counts or {}

# Create a simple tree
root = Node(attribute=0, samples=10, label_counts={'Yes': 6, 'No': 4})
leaf1 = Node(label='Yes', samples=6, label_counts={'Yes': 6})
leaf2 = Node(label='No', samples=4, label_counts={'No': 4})

root.children['left'] = leaf1
root.children['right'] = leaf2

# Test serialization
def node_to_dict(node):
    return {
        'attribute': node.attribute,
        'label': node.label,
        'samples': node.samples,
        'label_counts': node.label_counts
    }

print("Root:", node_to_dict(root))
print("Leaf1:", node_to_dict(leaf1))
print("Leaf2:", node_to_dict(leaf2))

# Test calculation
label = 'Yes'
label_counts = {'Yes': 6}
samples = 6
totalSamples = sum(label_counts.values()) or samples
labelCount = label_counts.get(label, samples)
percentage = (labelCount / totalSamples * 100) if totalSamples > 0 else 100

print(f"\nCalculation for leaf1:")
print(f"Label: {label}")
print(f"Total samples: {totalSamples}")
print(f"Label count: {labelCount}")
print(f"Percentage: {percentage}%")
print(f"Display: {label}\\n{percentage:.0f}%, {labelCount}/{totalSamples}")
