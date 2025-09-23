#!/bin/bash

server () {
  local port=${1:-8080}
  local address=${2:-0.0.0.0}
  if [[ $port -eq 80 ]]; then
    sudo python3 -m http.server --bind $address $port
  else
    python3 -m http.server --bind $address $port
  fi
}

server $1 $2
