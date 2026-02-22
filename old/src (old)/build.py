import os
import re

def build():
    src_dir = 'src'
    template_path = os.path.join(src_dir, 'index.html')
    output_path = 'index.html'

    if not os.path.exists(template_path):
        print(f"Error: {template_path} not found.")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inline CSS
    css_regex = re.compile(r'<link rel="stylesheet" href="css/(.*?)">')
    def replace_css(match):
        css_file = match.group(1)
        css_path = os.path.join(src_dir, 'css', css_file)
        if os.path.exists(css_path):
            with open(css_path, 'r', encoding='utf-8') as f:
                css_content = f.read()
                return '<style>\n' + css_content + '\n</style>'
        return match.group(0)

    content = css_regex.sub(replace_css, content)

    # Inline JS
    js_regex = re.compile(r'<script src="js/(.*?)"></script>')
    def replace_js(match):
        js_file = match.group(1)
        js_path = os.path.join(src_dir, 'js', js_file)
        if os.path.exists(js_path):
            with open(js_path, 'r', encoding='utf-8') as f:
                js_content = f.read()
                return '<script>\n' + js_content + '\n</script>'
        return match.group(0)

    content = js_regex.sub(replace_js, content)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Build successful: {output_path} generated.")

if __name__ == '__main__':
    build()
