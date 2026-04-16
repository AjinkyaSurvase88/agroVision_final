# Import TensorFlow (for deep learning)
import tensorflow as tf

# Import layers and model builder from Keras
from tensorflow.keras import layers, models

# For plotting graphs (accuracy/loss)
import matplotlib.pyplot as plt


# 📁 Path to your dataset folder
DATASET_PATH = "dataset"

# Resize all images to 224x224 (required for MobileNetV2)
IMG_SIZE = (224, 224)

# Number of images processed in one batch
BATCH_SIZE = 32


# 🔹 Load training dataset (80%)
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATASET_PATH,          # dataset folder path
    validation_split=0.2,  # 20% data for validation
    subset="training",     # this is training data
    seed=123,              # ensures same split every time
    image_size=IMG_SIZE,   # resize images
    batch_size=BATCH_SIZE  # batch size
)

# 🔹 Load validation dataset (20%)
val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",   # this is validation data
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)


# Get class names (folder names)
class_names = train_ds.class_names

# Count number of classes
num_classes = len(class_names)

# Print class labels
print("Classes:", class_names)


# 🔹 Normalize images (0–255 → 0–1)
train_ds = train_ds.map(lambda x, y: (x/255.0, y))
val_ds = val_ds.map(lambda x, y: (x/255.0, y))


# 🔹 Data augmentation (increase dataset diversity)
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),   # randomly flip images
    layers.RandomRotation(0.1),        # rotate slightly
    layers.RandomZoom(0.1),            # zoom in/out
])


# 🔹 Load MobileNetV2 (pretrained on ImageNet)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),  # input image shape
    include_top=False,          # remove original classifier layer
    weights="imagenet"          # use pretrained weights
)


# Freeze base model (do not train it initially)
base_model.trainable = False


# 🔹 Build final model
model = models.Sequential([
    tf.keras.Input(shape=(224, 224, 3)), 

    data_augmentation,   # apply augmentation

    base_model,          # feature extractor

    layers.GlobalAveragePooling2D(),  # convert feature maps → vector

    layers.BatchNormalization(),      # stabilize learning

    layers.Dense(128, activation="relu"),  # learn patterns

    layers.Dropout(0.5),              # prevent overfitting

    layers.Dense(num_classes, activation="softmax")  
    # output layer → probabilities for each class
])


# 🔹 Compile model (define how it learns)
model.compile(
    optimizer="adam",                       # optimization algorithm
    loss="sparse_categorical_crossentropy", # for multi-class classification
    metrics=["accuracy"]                    # track accuracy
)


# Print model architecture
model.summary()


# 🔹 Train model (Phase 1)
EPOCHS = 10

history = model.fit(
    train_ds,                 # training data
    validation_data=val_ds,   # validation data
    epochs=EPOCHS             # number of training cycles
)


# 🔥 Fine-tuning (Phase 2)

# Unfreeze base model (allow training)
base_model.trainable = True


# Freeze first 100 layers (keep basic features stable)
for layer in base_model.layers[:100]:
    layer.trainable = False


# Recompile with lower learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5),  # small learning rate
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)


# Train again (fine-tuning)
history_fine = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=5
)


# 💾 Save trained model
model.save("onion_mobilenet_model.h5")

print("✅ Model saved!")


# 📊 Plot accuracy graph

# Combine training + fine-tuning accuracy
plt.plot(history.history['accuracy'] + history_fine.history['accuracy'])

# Combine validation accuracy
plt.plot(history.history['val_accuracy'] + history_fine.history['val_accuracy'])

plt.title("Accuracy")              # graph title
plt.legend(["train", "val"])       # legend labels
plt.show()                         # display graph


