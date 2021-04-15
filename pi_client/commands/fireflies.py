from setup import LIGHTS, PIXELS
from random import randint, uniform
import time

fireflyIntensity = 50

while True:
    randLight = randint(0, LIGHTS-1)
    for i in range(fireflyIntensity):
        PIXELS[randLight] = (i, i, 0)
        time.sleep(.009)
        PIXELS.show()
    for i in range(fireflyIntensity+1):
        PIXELS[randLight] = ( fireflyIntensity-i, fireflyIntensity-i, 0 )
        time.sleep(.008)
        PIXELS.show()
    time.sleep( uniform(.4, 5) )
