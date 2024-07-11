import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import pickle

# Load data
data = pd.read_csv('user_responses.csv')

# Extract features and target variable
X = data[['question_id', 'response']]
y = data['next_question_id']

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a decision tree classifier
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Save the model to a file
with open('question_model.pkl', 'wb') as file:
    pickle.dump(model, file)
