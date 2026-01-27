import shutil
import os
from datetime import datetime

# Define paths to both Chrome profiles (with 'tool' as username)
chrome_bookmarks_path = os.path.expanduser(r'C:\Users\tool\AppData\Local\Google\Chrome\User Data\Default\Bookmarks')
chrome_canary_bookmarks_path = os.path.expanduser(r'C:\Users\tool\AppData\Local\Google\Chrome SxS\User Data\Default\Bookmarks')

# Define backup directory
backup_folder = os.path.expanduser('~/chrome_bookmarks_backup/')

# Create a unique backup directory based on the current date
backup_dir = os.path.join(backup_folder, datetime.now().strftime('%Y-%m-%d'))
os.makedirs(backup_dir, exist_ok=True)

# Define backup file names
timestamp = datetime.now().strftime('%H-%M-%S')
chrome_backup_filename = f'chrome_bookmarks_{timestamp}.json'
chrome_canary_backup_filename = f'chrome_canary_bookmarks_{timestamp}.json'

# Back up Chrome bookmarks
if os.path.exists(chrome_bookmarks_path):
    shutil.copy(chrome_bookmarks_path, os.path.join(backup_dir, chrome_backup_filename))
    print(f"Chrome bookmarks backup complete: {os.path.join(backup_dir, chrome_backup_filename)}")
else:
    print("Chrome bookmarks file not found!")

# Back up Chrome Canary bookmarks
if os.path.exists(chrome_canary_bookmarks_path):
    shutil.copy(chrome_canary_bookmarks_path, os.path.join(backup_dir, chrome_canary_backup_filename))
    print(f"Chrome Canary bookmarks backup complete: {os.path.join(backup_dir, chrome_canary_backup_filename)}")
else:
    print("Chrome Canary bookmarks file not found!")
