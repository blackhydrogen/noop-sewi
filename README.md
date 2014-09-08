# Single Encounter Web Interface (SEWI)

## Created for [Sana MDS](https://github.com/SanaHealth/sana.mds)

SEWI provides a web interface to view encounters in the Sana Mobile Dispatch Server.

##Installation Instructions

1. Clone this repository into the Sana MDS project app directory (same level as `settings.py`), in a directory named `sewi`.  
For example, if your `settings.py` is located in `/var/local/www/mds/settings.py`, the directory would be `/var/local/www/mds/sewi/`

2. Add the app to the `INSTALLED_APPS` directive in `settings.py` as `mds.sewi`:  
```python
INSTALLED_APPS = (
    ...
    'mds.sewi',
)
```
