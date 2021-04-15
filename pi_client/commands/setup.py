import board, neopixel
from random import randint

LED_PIN = board.D18
LIGHTS = 200
ORDER = neopixel.RGB
PIXELS = neopixel.NeoPixel(LED_PIN, LIGHTS, pixel_order=ORDER, auto_write=False)

def randomize():
    for i in range(LIGHTS):
        PIXELS[i] = ( randint(1,250), randint(1,250), randint(1,250) )
    PIXELS.show()

def clear():
    PIXELS.fill( (0,0,0) )
    PIXELS.show()

def allWhite():
    PIXELS.fill( (255,255,255) )
    PIXELS.show()

def fillColorString(colorString):
    color = tuple( map( int, colorString.split(',') ) )
    PIXELS.fill(color)
    PIXELS.show()
