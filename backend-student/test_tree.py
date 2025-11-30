from dt_entropy import DecisionTreeC45Entropy
import numpy as np
from collections import Counter

# Test data
X = np.array([['Sunny', 'Hot'], ['Rain', 'Cool'], ['Sunny', 'Cool']])
y = np.array(['No', 'Yes', 'Yes'])

attribute_name_dict = {0: 'Weather', 1: 'Temp'}
tree = DecisionTreeC45Entropy(attribute_name_dict, set())
decision_tree = tree.create_decision_tree(X, y)

# Check if node has samples and label_counts
print('Root samples:', decision_tree.samples)
print('Root label_counts:', decision_tree.label_counts)
print('Root label:', decision_tree.label)

# Check children
for key, child in decision_tree.children.items():
    print(f'\nChild {key}:')
    print(f'  samples: {child.samples}')
    print(f'  label_counts: {child.label_counts}')
    print(f'  label: {child.label}')
