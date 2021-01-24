# Car Web

Wird von Webserver auf dem RPi bereit gestellt und auf dem Touchscreen im Kiosk Modus angezeigt. Hört auf die Daten der Auto API und benachrichtigt den Fahrer über umliegende RTWs und ihr momentanes Ziel/Route. Ist eine Benachrictigung vorhanden, muss diese bestätigt werden, um weitere Benachrichtigungen über den gleichen RTW zu unterdrücken. Wird sie nicht unterdrückt, wird der Fahrer in Kürze erneut benachrichtigt.

- Holt alle 2 Sekunden die neusten Daten von der Auto API ab und zeigt, wenn vorhanden, eine Nachricht an
- Bietet die Möglichkeit zum Bestätigen der Benachrichtigung
