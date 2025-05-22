import cv2
import numpy as np
from tifffile import imread
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

#Load the image
image = imread("WITCH1.tif")

# Debug print to understand image properties
print(f"Original image shape: {image.shape}, dtype: {image.dtype}, min: {image.min()}, max: {image.max()}")

#Ensure image is in bgr format if it has 3 channels
if len(image.shape) == 3 and image.shape[2] == 3:
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

def auto_stretch(image, low_percent=.5, high_percent=99.0):
    low_val = np.percentile(image, low_percent)
    high_val = np.percentile(image, high_percent)
    print(f"Auto Stretching: low={low_val}, high={high_val}")

    clipped = np.clip(image, low_val, high_val)
    stretched = ((clipped - low_val) * 255 / (high_val - low_val)).astype('uint8')
    return stretched

def color_auto_stretch(image, low_percent=0.5, high_percent=90.0):
    channels = cv2.split(image)
    stretched_channels = []
    for i, channel in enumerate(channels):
        stretched = auto_stretch(channel, low_percent, high_percent)
        stretched_channels.append(stretched)

    stretched_image = cv2.merge(stretched_channels)
    return stretched_image

def plot_histogram_color(image, title="Histogram"):
    colors = ('r', 'g', 'b')
    plt.figure(figsize=(8,4))
    for i, color in enumerate(colors):
        channel = image[:, :, i]
        plt.hist(
            channel.ravel(), 
            bins=256, 
            range=(0, 255),
            density=False,
            color=color,
            alpha=0.5,
            label=f'{color.upper()} channel'
        )

    plt.title(title)
    plt.xlabel('Pixel Intensity')
    plt.ylabel('count')
    plt.legend()
    plt.grid(True)
    plt.savefig(title) 

#enhanced = remove_stars(image)
enhanced = color_auto_stretch(image)
#Display Histograms
plot_histogram_color(image, title="Original")
plot_histogram_color(enhanced, title="Stretched")
# Create a window to display images
cv2.namedWindow('Original', cv2.WINDOW_NORMAL)
cv2.namedWindow('Enhanced', cv2.WINDOW_NORMAL)
# Display images
cv2.imshow('Original', (image))
cv2.imshow('Enhanced', enhanced)

print("Images saved to current directory")
print("Press any key in the image windows to close them")

# Wait for a key press and then close all windows
cv2.waitKey(0)
cv2.destroyAllWindows()

# Step 12: Save the processed image
# Save as TIFF to preserve quality
cv2.imwrite("processed_witch1.tif", enhanced)