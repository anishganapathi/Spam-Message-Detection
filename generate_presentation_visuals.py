import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.pipeline import Pipeline

# 1. Load Data
print("Loading data...")
url = "https://raw.githubusercontent.com/justmarkham/DAT8/master/data/sms.tsv"
df = pd.read_csv(url, sep="\t", header=None, names=["label", "text"])
df["label_num"] = df["label"].map({"ham": 0, "spam": 1})

# 2. Split Data
X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["label_num"], test_size=0.2, random_state=42, stratify=df["label_num"]
)

# 3. Train Model
print("Training model...")
model = Pipeline([
    ("tfidf", TfidfVectorizer(stop_words="english")),
    ("clf", LogisticRegression(max_iter=200))
])
model.fit(X_train, y_train)

# 4. Generate Predictions
y_pred = model.predict(X_test)

# 5. Create Confusion Matrix
print("Generating Confusion Matrix...")
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Ham (Not Spam)', 'Spam'], 
            yticklabels=['Ham (Not Spam)', 'Spam'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix: Where did the model make mistakes?')

# Save the plot
plt.savefig('confusion_matrix.png')
print("Saved confusion_matrix.png")

# 6. Print Report for Presentation
print("\n" + "="*50)
print("METRICS REPORT FOR PRESENTATION")
print("="*50)
print(classification_report(y_test, y_pred, target_names=['Ham', 'Spam']))
print("="*50)
