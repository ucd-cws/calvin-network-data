#! /usr/bin/make -f

# These still need editing afterwards
pd.csv: S07I30PD.dss
	xvfb-run -a dssvue dss2csv.py --pd $< | grep -v 'ZREAD' > $@

rts.csv: S07I30TS.dss
	xvfb-run -a dssvue dss2csv.py --rts $< | grep -v 'ZREAD' > $@
