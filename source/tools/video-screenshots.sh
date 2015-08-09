#!/bin/sh

# cd into objects, then run ../source/tools/video-screenshots.sh

for vid in `find $1 *.m4v`;
do
	echo "extracting $vid"
    ffmpeg  -ss 0 -i $vid  -f image2 -vframes 1 $vid.png
done;

for png in `find $1 *.png`;
do
	echo "crushing $png"
	pngcrush -brute "$png" temp.png
	mv -f temp.png $png
done;
