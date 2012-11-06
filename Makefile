
SCRIPT_ALL=js/script.js
DEMO_SRC=demo.svg
DEMO_DST=build/demo.svg

demo: $(DEMO_SRC) $(SCRIPT_ALL)
	cat $(DEMO_SRC) | awk '{ if (/\/\/SCRIPT\/\//) x=1; if (!x) print }' > $(DEMO_DST)
	cat $(SCRIPT_ALL) >> $(DEMO_DST)
	cat $(DEMO_SRC) | awk '{ if (x) print; if (/\/\/SCRIPT\/\//) x=1 }' >> $(DEMO_DST)

clean:
	rm test_GENERATED.svg

