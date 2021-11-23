package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"regexp"

	"github.com/gorilla/websocket"
	"gopkg.in/yaml.v2"
)

const port = ":8080"

var config Config
var status Status
var upgrader = websocket.Upgrader{}
var connections map[*websocket.Conn]int = make(map[*websocket.Conn]int)

func main() {
	f, err := os.Open("application.yaml")
	if err != nil {
		log.Fatal("Couldn't load application context...", err)
	}
	defer f.Close()
	err = yaml.NewDecoder(f).Decode(&config)
	if err != nil {
		log.Fatal("Couldn't load application context...", err)
	}
	log.Println(config)
	http.HandleFunc("/ws", socketHandler)
	log.Fatal(http.ListenAndServe(port, nil))
}
func checkOrigin(r *http.Request) bool {
	origin := r.Header.Values("Origin")[0]
	for _, path := range config.Domain_Whitelist {
		matched, _ := regexp.MatchString(path, origin)
		if matched {
			return matched
		}
	}
	log.Printf("Origin %s is not whitelisted.", origin)
	return false
}
func socketHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = checkOrigin

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Error during connection upgradation:", err)
		return
	}
	log.Println("Client Connected...")
	defer conn.Close()
	connections[conn] = len(connections) + 1
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error during message reading:", err)
			break
		}
		var m Message
		err = json.Unmarshal(message, &m)
		if err != nil {
			log.Println("Error decoding:", err)
		}
		setState(&m)
		for connection, _ := range connections {
			err = connection.WriteJSON(status)
			if err != nil {
				log.Println("Error during message writing:", err)
				delete(connections, connection)
			}
		}
		log.Printf("%s", status)
	}
}
func setState(m *Message) {
	status.FullMessage = *m
	if m.Hex != "" {
		status.Hex = m.Hex
		status.State = "Color: " + m.Hex
		return
	}
	status.State = "Command: " + m.Command
}

type Message struct {
	Command        string `json:"command"`
	Color          string `json:"color"`
	Hex            string `json:"hex"`
	Modified_City  string `json:"modified_city"`
	Modified_IP    string `json:"modified_ip"`
	Modified_Name  string `json:"modified_name"`
	Modified_State string `json:"modified_state"`
}
type Status struct {
	State       string  `json:"state"`
	Hex         string  `json:"hex"`
	FullMessage Message `json:"message"`
}
type Config struct {
	Domain_Whitelist []string `yaml:"domain_whitelist"`
}
