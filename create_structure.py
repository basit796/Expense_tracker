import os

dirs = [
    'backend/src/main/java/com/expensetracker/models',
    'backend/src/main/java/com/expensetracker/services',
    'backend/src/main/java/com/expensetracker/utils',
    'backend/data',
    'frontend/src/app/login',
    'frontend/src/app/register',
    'frontend/src/app/dashboard',
    'frontend/src/components',
    'frontend/src/utils'
]

for dir_path in dirs:
    os.makedirs(dir_path, exist_ok=True)
    print(f'Created: {dir_path}')

print('\nDirectory structure created successfully!')
