#!/bin/bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$ROOT_DIR"
FE_PATH=''
BE_PATH='netbank-backend-spring'
SESSIONNAME="netbank-app"

# Default host
HOST="localhost"

# Check for 'ln' argument
if [ "$1" == "ln" ]; then
    # Get local IP address
    HOST=$(hostname -I | awk '{print $1}')
    echo "Using local network IP: $HOST"
else
    echo "Using localhost"
fi

# Check if session exists
tmux has-session -t $SESSIONNAME &> /dev/null

if [ $? != 0 ]; then
    # Create new session with a window
    tmux new-session -s $SESSIONNAME -n dev -d

    # Split window vertically
    tmux split-window -v -t $SESSIONNAME

    # In second pane (bottom), cd to be and run Django server
    tmux send-keys -t $SESSIONNAME:0.0 "cd $TARGET_DIR/$BE_PATH" C-m
    tmux send-keys -t $SESSIONNAME:0.0 "set -a; source .env; set +a" C-m
    tmux send-keys -t $SESSIONNAME:0.0 "./mvnw spring-boot:run" C-m

    # In first pane (top), cd to fe and run ng serve
    # tmux send-keys -t $SESSIONNAME:0.1 "cd $TARGET_DIR/$FE_PATH" C-m
    # tmux send-keys -t $SESSIONNAME:0.1 "ng serve --host $HOST" C-m

    # Back-end editor window
    tmux new-window -n Back-end -t $SESSIONNAME
    tmux send-keys -t $SESSIONNAME:1 "cd $TARGET_DIR/$BE_PATH" C-m
    tmux send-keys -t $SESSIONNAME:1 "nvim ." C-m

    # Front-end editor window
    # tmux new-window -n Fron-end -t $SESSIONNAME
    # tmux send-keys -t $SESSIONNAME:2 "cd $TARGET_DIR/$FE_PATH" C-m
    # tmux send-keys -t $SESSIONNAME:2 "nvim ." C-m

    # Select the first editor window by default
    tmux select-window -t $SESSIONNAME:0
fi

# Attach to session
tmux attach -t $SESSIONNAME
