# Genealogia Brennensis
### Stammbaum des Hauses von Brenig

**Eine interaktive Forschungsvisualisierung von Jennifer Brenig, 2025–2026**

🌐 **Live:** [brunonin88.github.io/Stammbaum-von-Brenig](https://brunonin88.github.io/Stammbaum-von-Brenig)  
☕ **Unterstützen:** [buymeacoffee.com/jenniferbrenig](https://www.buymeacoffee.com/jenniferbrenig)

---

## Was ist das?

Genealogia Brennensis ist kein gewöhnlicher Stammbaum. Es ist ein **prosopographisches Forschungswerkzeug** — entstanden aus dem Bedürfnis, über 1.100 Jahre Familiengeschichte wissenschaftlich nachvollziehbar zu dokumentieren.

Die App visualisiert **945+ Personen über 48 Generationen** — von den Merowingern (5. Jh.) bis in die Gegenwart — und macht dabei nicht nur sichtbar, *wer* mit wem verwandt ist, sondern *wie sicher* diese Verbindungen sind und *warum* sie angenommen werden.

**Das ist der entscheidende Unterschied zu kommerziellen Genealogie-Tools:**  
Ancestry oder MyHeritage zeigen Daten. Diese App zeigt Quellen, Unsicherheit und Denkwege.

---

## Features

### 🔬 Wissenschaftliche Quellenkritik
- **Visuell codierte Belegstärke** direkt am Knoten: grüner Rand = urkundlich gesichert, orange = erschlossen, grau gestrichelt = hypothetisch
- **Beweisgraph** für jede Verbindungslinie: gewichtete Faktoren (Filiationsformel +35, Archivbelege +12/Quelle, Namenskontinuität, Ortsnähe, Besitzkontinuität)
- **Gegenbeweis-Modus**: Das System versucht aktiv, jede Verbindung zu widerlegen — Datumskonflikte, konkurrierende Eltern, fehlende Filiationsformel
- **Konfidenz-Vererbung**: Wenn eine Hypothese in Generation 12 liegt, sind alle Nachkommen als "Kette unsicher" markiert

### 🕵 Analyse-Werkzeuge
- **Quellen-Konflikt-Detektor**: Findet widersprüchliche Quellenangaben automatisch (schwer / mittel / gering)
- **Prosopographisches Clustering**: Erkennt soziale Netzwerke durch gemeinsame Zeugen, Orte und Ämter — auch ohne direkte Urkundenverbindung
- **Forschungs-Roadmap**: Priorisierte Liste der wichtigsten Archivaufgaben nach Hebel-Score
- **Generationslücken-Berechnung**: Schätzt fehlende Personen mit Geburtsjahren ±5 Jahre und direkten Archivhinweisen
- **Namensauflöser "Wer könnte das sein?"**: Urkundenname eingeben → Kandidaten mit Prozent-Score nach Name, Zeit, Filiation, Ort, Titel

### 📜 Quellenarbeit
- **Volltext-Suche** in allen Quelltexten (z.B. "Mühle", "Zeuge", "Köln")
- **Signatur-Assistent**: HAK Best. 204 eingeben → direkter Link zu Monasterium.net, Archiv-Info, alle Personen mit dieser Signatur
- **Urkundenanalyse** in 7 Sprachstufen: Althochdeutsch, Mittelhochdeutsch, Frühneuhochdeutsch, Ripuarisch/Kölnisch, Latein (Urkunden- und Chronikstil)

### 🤖 KI-Features *(erfordert Internet)*
- **KI-Biografie** in 10 Sprachen inkl. Mittelhochdeutsch und Ripuarisch — basierend auf dokumentierten Fakten
- **Living Genealogy Chat**: Gespräch mit historischen Personen in der Sprache ihrer Zeit
- **KI-Urkundenanalyse**: Strukturierte Extraktion von Personen, Orten, Ämtern, Beziehungsformeln

### 🗺 Navigation & Visualisierung
- D3.js Force-Graph mit 945+ Knoten
- Historische Kartenebenen (OSM, Hist. Topographische Karte NRW, Urkataster ca. 1830)
- Minimap / Übersicht
- Zeitreise-Modus: nur Personen sichtbar die zu einem Jahr lebten
- Pfad-Finder: kürzester Verwandtschaftsweg zwischen zwei Personen

### 📤 Export
- HTML, CSV, JSON, Markdown (Feldauswahl, Personenauswahl)
- GEDCOM-Export und -Import
- PNG-Export des Graphen

---

## Technisches

| Eigenschaft | Wert |
|-------------|------|
| **Technologie** | Vanilla HTML/CSS/JavaScript, D3.js v7, Fuse.js |
| **Dateigröße** | ~1,2 MB (eine einzige HTML-Datei) |
| **Offline** | Vollständig offline-fähig — kein Server, keine Registrierung |
| **KI** | Claude API (Anthropic) — nur online-Features |
| **Analytics** | GoatCounter (datenschutzfreundlich, DSGVO-konform) |
| **PWA** | Progressive Web App, installierbar auf Android/iOS |

Die gesamte Anwendung besteht aus **einer einzigen HTML-Datei**. Das ist eine bewusste Entscheidung: Archivare können die Datei per USB-Stick ins Archiv mitnehmen und ohne Internet öffnen.

---

## Methodische Grundsätze

- Eltern-Kind-Links nur bei explizitem "filius/filia" oder äquivalenter Formel in der Quelle
- Topographische Cluster stützen Hypothesen, begründen aber keine direkten Links
- Alle offenen Fragen sind in den Knoten-Rolltexten dokumentiert
- Gen. 0–20 (Merowinger, Karolinger) nach MGH-Editionen, als "sagenhaft" markiert
- Nicht additive Aggregation, sondern strukturierende Synthese (*Quellenvernähung*)

### Verwendete Archive
- **HAK** — Historisches Archiv Köln: Schreinsbücher, Urkunden ab 1180
- **MGH** — Monumenta Germaniae Historica
- **LAV NRW** — Landesarchiv NRW: Kirchenbücher, Familienbücher
- **FamilySearch** — Digitale Kirchenbücher
- **Feldforschung** — Grabsteine Bad Godesberg, Mai 2026

---

## Dynastien

| Farbe | Dynastie | Zeitraum |
|-------|----------|----------|
| 🔴 Dunkelrot | Merowinger / Karolinger | 5.–10. Jh. |
| 🟤 Braun | Brunonen / Ezzonen | 10.–12. Jh. |
| 🔵 Blau | Brenig / von Brenich | 12.–21. Jh. |
| 🟡 Gold | Ottonen / Salier | 10.–12. Jh. |

---

## Knotenfarben verstehen

| Rand | Bedeutung |
|------|-----------|
| 🟢 Grün, durchgezogen | Urkundlich gesichert (HAK, MGH, Schreinsbücher) |
| 🟠 Orange, durchgezogen | Erschlossen / wahrscheinlich |
| ⚫ Grau, gestrichelt | Hypothetisch, nicht urkundlich belegt |
| 🔴 Rot, gestrichelt (äußerer Ring) | Kettenkonfidenz gebrochen — Hypothese in Vorfahrenkette |

---

## Über das Projekt

Ich bin **Jennifer Brenig** — Forscherin, Autorin und Creative Technologist. Die App entstand aus einem ganz persönlichen Projekt: der Rekonstruktion meiner eigenen Familiengeschichte.

Irgendwann wurden die Quellen, Hypothesen und Verbindungen so komplex, dass kein bestehendes Tool sie abbilden konnte. Also habe ich angefangen, eines zu bauen.

Das Ergebnis ist kein "Stammbaum-Programm" mehr. Es ist ein Forschungswerkzeug für prosopographische Quellenarbeit — das zufällig auf dem Stammbaum meiner Familie basiert.

**Kontakt & Feedback:** [jenniferbrenig@gmail.com](mailto:jenniferbrenig@gmail.com?subject=Feedback Genealogia Brennensis)

---

## Lizenz

**© 2025–2026 Jennifer Brenig. Alle Rechte vorbehalten.**

### Code
Der Quellcode steht unter der Lizenz **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**:
- ✅ Ansehen, lernen, für private und wissenschaftliche Zwecke nutzen
- ✅ Teilen mit Namensnennung ("Basierend auf Genealogia Brennensis von Jennifer Brenig")
- ❌ Kommerzielle Nutzung ohne ausdrückliche schriftliche Genehmigung
- ❌ Weitervertrieb als eigenes Produkt

### Forschungsdaten
Die Forschungsdaten (Personendaten, Quelltexte, Regesten, Hypothesen) sind **urheberrechtlich geschützt** und dürfen **nicht** ohne Erlaubnis weitergegeben, kopiert oder in anderen Projekten verwendet werden.

### Kommerzielle Nutzung
Für kommerzielle Lizenzen, institutionelle Anpassungen oder Kooperationen:  
📧 [jenniferbrenig@gmail.com](mailto:jenniferbrenig@gmail.com?subject=Lizenzanfrage Genealogia Brennensis)

[![CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc/4.0/)

---

*Genealogia Brennensis · Jennifer Brenig · 2025–2026 · Köln/Rheinland*
