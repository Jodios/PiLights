from setup import PIXELS
import time

while(True):
    PIXELS.fill( (255,0,0) )
    PIXELS.show()
    time.sleep(.2)
    PIXELS.fill( (0,0,255) )
    PIXELS.show()
    time.sleep(.2)
