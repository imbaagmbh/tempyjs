#H2 Tempy.js: Client-Side-Templating mit HTML5 Local Storage


Bei der Entwicklung von WebApps suchen Webworker immer wieder nach einer Stellschraube,
die zu einer besseren Performance beitragen könnten. Bei einer WebApp, die wir derzeit
in unserer [Werbeagentur imbaa](https://www.imbaa.de) entwicklen, boten vor allem Cleintseitige
Templates eine Herausforderung.

Das Ziel ist ein modulares Template System, das verschiedene App-Bestandteile
asynchron neu rendern kann, zu realisieren. Hierfür bieten sich verschiedene Optionen an.

#H3 Option 1: Komplette HTML-Blöcke vom Server vorverarbeitet an den Client schicken.

Dies ist sicherlich am einfachsten zu realisieren, da Clientseitig nur wenig Prozesslogik erfordert
wird und die Template Engine auf der Server Seite alles unkompliziert erledigen kann.
Jedoch kann man bei diesem Ansatz kaum Vorteile vom Caching der Templates ziehen, sodass der
Client durch unnötig viele Daten und der Server durch unnötige Template-Verarbeitung zusätzlich belastet wird.

#H3 Option 2: Clientseitige Templates über Script-Tag

Bei clientseitigem Templating ist es gängige Praxis, die jeweiligen Templates innerhalb eines Script-Tag
mit dem Hauptdokument zusammen auszuliefern. So erspart man sich zusätzliche Aufrufe separater Templates
und kann sehr schnell clientseitig auf die jeweiligen Templates zugreifen.
Für ein komplexes System wird diese Lösung auf Dauer bei zunehmender Anzahl von Templates jedoch schnell
unübersichtlich und irgendwann auch nicht mehr performant.

#H3 Option 3: Clientseitige Templates über AJAX nachladen.

Die Übertragung von Templates über AJAX zur Weiterverarbeitung in Template Systemen wie Moustache oder
Handlebars schien hier die beste Lösung zu sein. Die Templates können so kleinteilig wie nötig aufgesplittert
werden und werden in der Regel nach dem ersten Aufruf  gecached.

Diese Lösung ging jedoch nicht weit genug. Hier hat uns Basket.js – eine Bibliothek, die JavaScript in den Local Storage des Browsers
ablegen und so blitzschnell ohne zusätzliche Requests zur Verfügung stellen kann – inspiriert.
Besonders auf mobilen Geräten soll so ein zusätzlicher Performance Schub ermöglicht werden.

Diese Idee haben wir nun in der Bibliothek tempy.js in abgewandelter Form umgesetzt.

#H2 Das Konzept von Tempy.js

Tempy.js bietet im Zusammenspiel mit einer Server-Applikation eine schnelle Lösung
für das Abrufen und Speichern von clientseitigen Templates. Die Bibliothek ruft
Templates via AJAX-Request von einer PHP-Applikation ab und speichert diese im LocalStorage des Browsers.
Ab dann stehen die Templates auf Clientseite sofort und ohne Kommunikation mit dem Server zur Verfügung,
sodass auch Offline-Applikationen denkbar sind.

Ein weiterer Vorteil in der Aufteilung, ist die Möglichkeit Templates auf dem Server vorzuverarbeiten
(zum Beispiel übersetzen) und zusammengehörige Templates bei einem Aufruf zu übertragen. Dazu aber später mehr.

#H2 Tempy.js benutzen

Tempy.js benötigt derzeit jQuery um die nötigen Requests an den Server zu stellen. Nachdem jQuery und Tempy.js in die WebApp
eingebunden sind, können mittels einer einfacher API Template Dateien abgerufen werden.

Du kannst einzelne Templates oder mehrere Templates in einem Rutsch anfordern, ganz, wie deine Programmlogik es erfordert.

```
// Ein Template anfordern
var template1 = tempy.get({name:"template1"});
// Mehrere Templates anfordern
var templates = tempy.get(
    {name:"template2"},
    {name:"template3"},
    {name:"template1"},
    {name:"template4"}
);
```

Als Rückgabewert erhältst du den Template-String, den du an eine clientseitige Template Engine weiterreichen, oder wie im unterstehenden Beispiel direkt ins Dokument einfügen kannst.

[code lang="JavaScript"]// Template einfügen, wenn ein Template angefordert wurde
$('#content').append(template1);
//Bestimmtes Template einfügen, wenn mehrere Templates angefordert wurden
$('#content').append(templates['template1']);[/code]

Um nicht unnötig viele Abhängigkeiten beim Aufruf im JavaScript festhalten zu müssen, bietet die serversetige Komponente von tempy.js die Möglichkeit Template Packs zu definieren. Bei jeder Anforderung eines Templates wird geprüft, ob für die Programmlogik weitere Templates benötigt werden und zusammen mit dem angeforderten Template mit nur einem einzigen Aufruf an den Client übertragen.

Hierfür müssen lediglich die Abhängigkeiten in einer separaten Datei (pack.info) im JSON Format hinterlegt werden.

```
{
    "mainView":[
        "template1",
        "template2",
        "template3",
        "template4"
    ]
}
```

Fordert man nun also  das Template „mainView“ an, werden die dazugehörigen Templates template1, template2, template3 und template4 mit übertragen.

Tempy.js API und Konfiguration

Tempy.js lässt sich über eine Reihe von Befehlen steuern.

1. tempy.get() ruft Templates ab
2.tempy.clear() überprüft ob veraltete Templates im LocalStorage hinterlegt sind
3.tempy.flush() löscht sämtliche Templates aus dem LocalStorage des Clients

Standardmäßig behält Tempy.js Templates für 10 Stunden im Cache und fragt Templates von der templateServer.php ab. Diese Werte können wie auch das Storage-Prefix, der zur Unterscheidung der Tempy.js Daten von anderen Daten im LocalStorage ermöglicht, nach Belieben in der Bibliothek selbst angepasst werden, um es den eigenen Anforderungen anzupassen.

```
var storagePrefix = 'tempy-';
var defaultExpiration = 10;
var templateServer = "templateServer.php";
```

Für die Zukunft planen wir weitere Funktionen wie die Integration von JavaScript Template Engines und eine Require.js Implementation von Tempy.js. Solange steht die aktuelle Fassung von Tempy.js zum Download auf GitHub zur Verfügung.