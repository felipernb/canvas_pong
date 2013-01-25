package pongroulette

import (
	"net/http"
	"fmt"
	"encoding/json"
	"strconv"
	"container/list"

	"appengine"
	"appengine/channel"
)

const (
	WAITING_PARTNER = iota
	FOUND_PARTNER = iota
	PARTNER_LEFT = iota
	PARTNER_MOVED = iota
	SYNC = iota
)

var users = 0
var pairs map[string]string
var waiting *list.List

func init() {
	pairs = make(map[string]string)
	waiting = list.New()

	http.HandleFunc("/ping", ping)
	http.HandleFunc("/connect", connect)
	http.HandleFunc("/move", move)
	http.HandleFunc("/_ah/channel/connected/", rendezVous)
	http.HandleFunc("/_ah/channel/disconnected/", disconnect)
}

func ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Pong")
}

func connect(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	users++
	id := strconv.Itoa(users)
	tok, err := channel.Create(c, id)
	if err != nil {
		http.Error(w, "Couldn't create Channel", http.StatusInternalServerError)
		c.Errorf("channel.Create: %v", err)
		return
    }
	payload, _ := json.Marshal(map[string] string {"me": id,"token": tok})
	fmt.Fprint(w, string(payload))
}

func rendezVous(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	id := r.FormValue("from")
	if waiting.Len() == 0 {
		waiting.PushBack(id)
		channel.SendJSON(c, id, map[string]int{"t" : WAITING_PARTNER})
		c.Infof("User %v added to the waiting list", id)
	} else {
		opponent := waiting.Front()
		opponentId, _ := opponent.Value.(string)
		waiting.Remove(opponent)
		channel.SendJSON(c, id, map[string]int{"t" : FOUND_PARTNER})
		channel.SendJSON(c, opponentId, map[string]int{"t" : FOUND_PARTNER})
		pairs[opponentId] = id
		pairs[id] = opponentId
		c.Infof("Matching user %v with %v", id, opponentId)
	}
}

func disconnect(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	id := r.FormValue("from")
	_, isPaired := pairs[id]
	if isPaired {
		partner := pairs[id]
		delete(pairs, id)
		delete(pairs, partner)
		channel.SendJSON(c, partner, map[string]int{"t": PARTNER_LEFT})
		c.Infof("Removed Pair %v,%v", id, partner)
	} else {
		for e := waiting.Front(); e != nil; e = e.Next() {
			if e.Value == id {
				waiting.Remove(e)
				c.Infof("User %v removed from the waiting list", id)
				return
			}
		}
	}
}

func move(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	id := r.FormValue("from")
	y, _ := strconv.Atoi(r.FormValue("y"))
	direction, _ := strconv.Atoi(r.FormValue("d"))
	channel.SendJSON(c, pairs[id], map[string]int{"t": PARTNER_MOVED, "y": y, "d": direction})
}

