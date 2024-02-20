import pandas as pd
import random
import string
from datetime import datetime, timedelta


token_ids = list(range(1, 101))
owners = [''.join(random.choices(string.ascii_letters, k=8))
          for _ in range(100)]
df_721 = pd.DataFrame({'token_id': token_ids, 'name': owners})
df_721.to_csv('1155.csv', index=False)


start_date = datetime.strptime('15/Feb/2024', '%d/%b/%Y')
end_date = datetime.today()
date_range = [start_date + timedelta(days=x)
              for x in range((end_date-start_date).days + 1)]


ids = []
token_ids_history = []
prices = []
dates_history = []

id_counter = 1
for token_id in token_ids:
    for date in date_range:
        ids.append(id_counter)
        token_ids_history.append(token_id)
        prices.append(round(random.uniform(0.1, 10), 2))
        dates_history.append(date)
        id_counter += 1

df_721history = pd.DataFrame(
    {'ID': ids, 'token_id': token_ids_history, 'Price': prices, 'date': dates_history})
df_721history.sort_values(by=['token_id', 'date'], inplace=True)
df_721history.to_csv('1155history.csv', index=False)
