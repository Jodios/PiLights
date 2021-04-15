from setup import LIGHTS, PIXELS
import time


red = (255, 0, 0)
blue = (0, 0, 255)
redStart=0
blueStart=int(LIGHTS/2)
timeInMillis = 2

while True:
    for i in range(redStart,blueStart):
        PIXELS[i%LIGHTS] = red
    
    blueStart = redStart + int(LIGHTS/2)
    for i in range(blueStart, blueStart+int(LIGHTS/2)):
        PIXELS[i%LIGHTS] = blue
    redStart = (redStart+1)%LIGHTS
    PIXELS.show()
