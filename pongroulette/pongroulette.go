package pongroulette

import (
	"net/http"
	"fmt"
)

func init() {
	http.HandleFunc("/ping", ping)
}

func ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Pong")
}
