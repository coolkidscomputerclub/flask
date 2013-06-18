#!/bin/bash

convert analog/* -set filename:orig "%t" -format jpg -resize 1380 'resized/%[filename:orig].jpg'