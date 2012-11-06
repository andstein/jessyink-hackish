
SCRIPT_SRC=js/dom.js js/effects.js js/elements.js js/export.js js/header.js js/index.js js/init.js js/matrix.js js/progress.js js/slide.js js/substitute.js js/uia.js js/utils.js
SCRIPT_ALL=build/script.js
DEMO_SRC=demo.svg
DEMO_DST=build/demo.svg

$(DEMO_DST): $(DEMO_SRC) $(SCRIPT_ALL)
	cat $(DEMO_SRC) | awk '{ if (/\/\/SCRIPT\/\//) x=1; if (!x) print }' > $(DEMO_DST)
	cat $(SCRIPT_ALL) | sed -e's/&/\&amp;/g' | sed -e's/</\&lt;/g' | sed -e's/>/\&gt;/g' | sed -e's/"/\&quot;/g' >> $(DEMO_DST)
	cat $(DEMO_SRC) | awk '{ if (x) print; if (/\/\/SCRIPT\/\//) x=1 }' >> $(DEMO_DST)

$(SCRIPT_ALL): $(SCRIPT_SRC)
	cat $(SCRIPT_SRC) > $(SCRIPT_ALL)

clean:
	rm $(SCRIPT_ALL)
	rm $(DEMO_DST)

