from PIL import Image
import os

# 源图标路径
source_icon = r'D:\360MoveData\Users\天道酬勤\Pictures\表情包\tangmao.jpg'

# 目标文件夹
output_dir = r'd:\trae_project\app\deploy\icons'
os.makedirs(output_dir, exist_ok=True)

# 需要的图标尺寸
icon_sizes = [72, 96, 128, 144, 152, 192, 384, 512]

try:
    # 打开原图
    img = Image.open(source_icon)
    
    # 确保是 RGBA 模式（支持透明背景）
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # 生成各个尺寸的图标
    for size in icon_sizes:
        # 调整大小
        resized = img.resize((size, size), Image.LANCZOS)
        
        # 保存为 PNG
        output_path = os.path.join(output_dir, f'icon-{size}x{size}.png')
        resized.save(output_path, 'PNG')
        print(f'✓ 已创建: icon-{size}x{size}.png')
    
    print(f'\n✅ 所有图标已创建到: {output_dir}')
    
except Exception as e:
    print(f'❌ 错误: {e}')
