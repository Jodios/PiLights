from setup import PIXELS, LIGHTS, clear
import time
from random import randint

forward = True

while True:
    for i in range(LIGHTS):
        clear()
        seconds = .01 if i == LIGHTS-1 else .09
        index = i if forward else (LIGHTS-1) - i
        PIXELS[index] = ( randint(1,250), randint(1,250), randint(1,250) )
        PIXELS.show()
        time.sleep(seconds)
    forward = not forward

