import ClassifierModel
from ClassifierModel import *
import sys
import json

data = {
    "product_id": sys.argv[1],
    "question": sys.argv[2]
}


model = ClassifierModel(path=sys.argv[3])
results = model.run_models(data)

print(json.dumps(results))
sys.stdout.flush()
