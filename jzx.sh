#!/bin/zsh

# Path to the text file
file_path="/Users/peterorum/Projects/dailyjzx/words.txt"

# Count the number of lines in the file
num_lines=$(wc -l < $file_path)

# Generate a random number between 1 and the number of lines
rand_num=$((1 + RANDOM % num_lines))

# Print the random line
sed -n "${rand_num}p" $file_path

#pause
read