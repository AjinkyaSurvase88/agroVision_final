import json

# Copy class names from your training output
class_names = [
    'Alternaria_D',
    'Botrytis Leaf Blight',
    'Bulb Rot',
    'Bulb_blight-D',
    'Caterpillar-P',
    'Downy mildew',
    'Fusarium-D',
    'Healthy leaves',
    'Iris yellow virus_augment',
    'Purple blotch',
    'Rust',
    'Virosis-D',
    'Xanthomonas Leaf Blight',
    'stemphylium Leaf Blight'
]

# Save to JSON
with open("classes.json", "w") as f:
    json.dump(class_names, f)

print("✅ classes.json saved!")