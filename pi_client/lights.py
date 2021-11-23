import websocket
import json
import subprocess
import shlex
import time
from sys import argv
from commands.setup import clear, allWhite, fillColorString, randomize

url = "wss://lights-socket.jodios.com/ws"
process = None
stdOutputHandle = open("LightsLogs.txt", "a")
errOutputHandle = open("LightsErrorLogs.txt", "a")


def run(script):
    global stdOutputHandle, errOutputHandle
    scriptArgs = shlex.split(script)
    log(scriptArgs)
    procHandle = subprocess.Popen(
        scriptArgs, stdout=stdOutputHandle, stderr=errOutputHandle)
    return procHandle


def isScriptRunning(procHandle):
    return procHandle.poll() is None


def stopScript(procHandle):
    procHandle.kill()
    procHandle.wait()


def log(message):
    print(message)


def on_message(ws, message):
    global process
    print(ws)
    data = json.loads(message)['message']
    if process and isScriptRunning(process):
        stopScript(process)
    if 'command' in data:
        log(data['command'])
        if data['command'] == "off":
            clear()
        elif data['command'] == "on":
            allWhite()
        elif data['command'] == "random":
            randomize()
        else:
            process = run(
                "python3 /home/pi/pilights/pi_client/commands/"+data['command']+".py")
    if 'color' in data and data['color'] != "":
        fillColorString(data['color'])


def on_error(ws, error):
    log(error)


def on_close(ws):
    global process
    ws = None
    if process and isScriptRunning(process):
        stopScript(process)
    log("### RETRYING ###")
    time.sleep(10)
    start()


def on_open(ws):
    log("### CONNECTED ###")


def start():
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(
        url, on_open=on_open, on_message=on_message, on_error=on_error, on_close=on_close)
    ws.run_forever()


if __name__ == '__main__':
    start()
