import cv2
import numpy as np
from tifffile import imread
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

#Load the image
image = imread("Lagoon-Nebula-Stock-DSLR-AstroBackyard.tif")

# Debug print to understand image properties
print(f"Original image shape: {image.shape}, dtype: {image.dtype}, min: {image.min()}, max: {image.max()}")

#Ensure image is in bgr format if it has 3 channels
if len(image.shape) == 3 and image.shape[2] == 3:
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

#normalize the image data
image_norm = cv2.normalize(image.astype("float32"), None, 0.0, 1.0, cv2.NORM_MINMAX)

#convert to 8_bit depth since opencv algorithms mainly work in 8 bits
image_8bit = (image_norm * 255).astype('uint8')

image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def auto_stretch(image, low_percent=.5, high_percent=95.0):
    low_val = np.percentile(image, low_percent)
    high_val = np.percentile(image, high_percent)
    print(f"Auto Stretching: low={low_val}, high={high_val}")

    clipped = np.clip(image, low_val, high_val)
    stretched = ((clipped - low_val) * 255 / (high_val - low_val)).astype('uint8')
    return stretched

def remove_stars(image, threshold=1000):
    max_val = np.max(image)
    print(f"using threshold: {threshold} (from max value: {max_val})")
    if len(image.shape) == 3:
        brightness = np.mean(image, axis=2)
    else:
        brightness = image
    
    star_mask = brightness > threshold
    result = image.copy()
    result[star_mask]=0
    return result

def color_auto_stretch(image, low_percent=10.0, high_percent=99.0):
    channels = cv2.split(image)
    stretched_channels = []
    for i, channel in enumerate(channels):
        stretched = auto_stretch(channel, low_percent, high_percent)
        stretched_channels.append(stretched)

    stretched_image = cv2.merge(stretched_channels)
    return stretched_image


#enhanced = remove_stars(image)
enhanced = color_auto_stretch(image)
# Replace the matplotlib visualization code with:
# Create a window to display images
cv2.namedWindow('Original', cv2.WINDOW_NORMAL)
cv2.namedWindow('Enhanced', cv2.WINDOW_NORMAL)
# Display images
cv2.imshow('Original', (image_norm * 255).astype('uint8'))
cv2.imshow('Enhanced', enhanced)

print("Images saved to current directory")
print("Press any key in the image windows to close them")

# Wait for a key press and then close all windows
cv2.waitKey(0)
cv2.destroyAllWindows()

# Step 12: Save the processed image
# Save as TIFF to preserve quality
cv2.imwrite("processed_witch1.tif", enhanced)