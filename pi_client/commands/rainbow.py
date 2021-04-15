from setup import PIXELS, LIGHTS
from math import sin, pi
import time

center = 128
width = 127
frequency = pi*4/LIGHTS
phase = 0

while True:
    phase = (phase + .03) % 360 
    for i in range(LIGHTS):
        r = sin(frequency*i+2+phase) * width + center
        g = sin(frequency*i+0+phase) * width + center
        b = sin(frequency*i+4+phase) * width + center
        PIXELS[i] = ( (r,g,b) )
    PIXELS.show()
    time.sleep(.008)
