import os

def find_stray_div(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith(('.jsx', '.js', '.html', '.css')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            if '/div>' in line and '<' not in line:
                                print(f"{path}:{i+1}: {line.strip()}")
                except Exception as e:
                    pass

find_stray_div('.')
