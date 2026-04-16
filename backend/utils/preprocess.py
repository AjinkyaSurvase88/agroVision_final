from PIL import Image
import numpy as np

def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))      # resize
    img_array = np.array(image) / 255.0   # normalize
    img_array = np.expand_dims(img_array, axis=0)  # batch dimension
    return img_array