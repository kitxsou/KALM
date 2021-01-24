# EV Node

Läuft auf RPi in RTW, kommuniziert mit Rescue-Track und sendet via Radiodaten an umliegende Autos

- Alle 2 Sekunden aktualisiert der RTW seine Position + Route
  - GPS Koordinaten von RTW abholen
  - Rescue-Track API benutzen um die Routenpunkte abzuholen
- Permanent sendet der RTW seine Position als Routenpunkt sowie weitere Routenpunkte, um die Autos in diesen Teilabschnitten seiner Route zu warnen
