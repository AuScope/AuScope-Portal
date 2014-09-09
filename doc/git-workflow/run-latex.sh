#!/bin/sh

path="$1"

case "$path" in
	*.tex)	echo "[INFO] document $path" ;;
	*)	echo "Wrong file type : $path"; exit 1;;
esac

file=`basename $path`
dir=`dirname "$path"`

if [ -n "$dir" -a -d "$dir" ]
then
	cd $dir
	echo "[INFO] cd $dir"
fi

# Multi-part documents...

fgrep --quiet 'begin{document}' $file
if [ $? -ne 0 ]
then
	# if there's a file called ".latex-main" then it contains the name of
	# the real file to process.

	cfg='.latex-main'
	if [ -f "$cfg" ]
	then
		read file < $cfg
		echo "[INFO] main = $file"
	fi
	
	if [ ! -f "$file" ]
	then
		echo "[WARN] No file : $file"
		exit 3
	fi
fi

base=`basename "$file" .tex`



# environment
T=$HOME/Templates
TEMPLATE=.:$T/one-csiro
CURRENT=$(kpsewhich -expand-var '$TEXINPUTS')

TEXINPUTS=$TEMPLATE:$CURRENT
export TEXINPUTS

# first pass
opts="-halt-on-error -interaction nonstopmode"

pdflatex $opts $base.tex
if [ $? -ne 0 ]
then
	echo "[WARN] LaTeX error at `date`"
	exit 1
fi

# run bibtex over all files with \cite
for f in `ls *.tex`
do
	fgrep --quiet 'cite{' $f
	if [ $? -eq 0 ]
	then
		echo "[INFO] bib $f"
		bibtex `basename $f .tex`
	fi
done

# bibunits?

for f in `ls bu[1-9].aux`
do
	bubase=`basename $f .aux`

	if [ -s "$f" ]
	then
		bibtex $bubase
	fi
done

# a few more times...
pdflatex $opts $base.tex
pdflatex $opts $base.tex

#if [ $? -eq 0 ]
#then
#	evince $base.pdf &
#fi

echo "[INFO] finished `date`"
