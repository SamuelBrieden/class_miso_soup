Some changes were made to the original code to update it from Python 2 to Python3 and allow it to run without errors.
1. In lines 74 and 101 in Calc2D/CalculationClass.by it needs to be ensured that the numbers are of type integer by using int().
2. In lines 162, 163, 185 and 187 in "tornadoserver.py", .decode('utf-8') needs to be added. Any mention of "iteritems()" needs to be replaced by "items()".
3. The file Calc2D/Database needs to be updated so that anytime there is a write statement indicated by "w", it is replaced by "wb". Any read statement id by "r" is replaced by "rb".
4. The class JSONEEncoder() needs to be added to "tornadoserver.py" as follows:
mport json 

import numpy as np 

  

class JSONEncoder(json.JSONEncoder): 

    def default(self, obj): 

        if isinstance(obj, np.integer): 

            return int(obj) 

        elif isinstance(obj, np.floating): 

            return float(obj) 

        elif isinstance(obj, np.ndarray): 

            return obj.tolist() 

        else: 

            return super(JSONEncoder, self).default(obj) 

  

data = [np.int64(1), np.int64(2), np.int64(3)] 

json.dumps(data, cls=JSONEncoder) 

Line 124 in the same file needs to be changed to:
for message in messages: 

                self.write_message(json.dumps(message, cls=JSONEncoder))) 