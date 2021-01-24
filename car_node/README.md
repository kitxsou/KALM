# Car Node

Läuft auf RPi im Auto und hört auf die Radiodaten von umliegenden RTWs. Dient ebenfalls API für Auto Website

- (Wenn GPS aktiv ist) Alle 2 Sekunden aktualisiert das Auto seine Position ~~+ Route~~
  - GPS Koordinaten abholen
  - ~~Rescue-Track API benutzen um die Routenpunkte abzuholen~~
- Permanent hört das Auto auf umliegende Radiokommunikation von RTWs
- Empfängt das Auto Signale von einem RTW...
  - ... und GPS ist aktiv wird berechnet, ob der RTW auf der gleichen Route wie das Auto fährt und wenn ja, benachrichtigt das Auto über verschiedene Systeme (Monitor, Vibration, RGB) den Fahrer
  - ... und GPS ist inaktiv benachrichtigt das Auto über verschiedene Systeme (Monitor, Vibration, RGB) den Fahrer (ohne Richtungsangabe)
