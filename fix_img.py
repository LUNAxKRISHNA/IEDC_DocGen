import base64
import os

img_path = r"backend\images\IEDC x KSUM.png"
template_path = r"backend\templates\event_report.html"

with open(img_path, "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode("utf-8")

with open(template_path, "r", encoding="utf-8") as f:
    html = f.read()

target_str = 'src="backend\\images\\IEDC x KSUM.png"'
replacement_str = f'src="data:image/png;base64,{img_b64}"'

html = html.replace(target_str, replacement_str)

with open(template_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Replaced image with base64 successfully.")
