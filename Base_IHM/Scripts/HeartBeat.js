// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.750.1/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();
        // ----------------------
        // Place your code here!
        
        var myVar3 = setInterval(AtualizaHeartbeat, 1000);
        var myVar4 = setInterval(AtualizaHora, 1000);


        window.setTimeout(function () {
            window.location.reload();
        }, 1000 * 60 * 60 * 12);

        // ----------------------
    });
})(TcHmi);

function AtualizaHeartbeat() {

    var heart = TcHmi.Symbol.readEx("%i%xHeartBeat%/i%");

    if (heart) {

        TcHmi.Symbol.writeEx("%i%xHeartBeat%/i%", false);
        //console.log("Heartbeat = False");


    } else {

        TcHmi.Symbol.writeEx("%i%xHeartBeat%/i%", true);
        //console.log("Heartbeat = True");
    }


};

function AtualizaHora() {



    // cria um objeto Date
    const data = new Date();

    // obtém a hora, minuto e segundo atual
    var hora = data.getHours();
    var Dia = data.getDay();

    hora = hora - 1;
    Dia = Dia - 1;

    if (Dia < 0) {
        Dia = 0;
    }
    if (hora < 0) {
        hora = 0;
    }

    TcHmi.Symbol.writeEx("%i%iHora%/i%", hora);
    TcHmi.Symbol.writeEx("%i%iDia%/i%", Dia);
    //console.log(Dia);
    //const minuto = data.getMinutes();
    //const segundo = data.getSeconds();

};

/*function AtualizaHeartbeat2() {

    var heart = TcHmi.Symbol.readEx("%i%xHeartBeat100ms%/i%");

    if (heart) {

        TcHmi.Symbol.writeEx("%i%xHeartBeat100ms%/i%", false);
        //console.log("Heartbeat = False");


    } else {

        TcHmi.Symbol.writeEx("%i%xHeartBeat100ms%/i%", true);
        //console.log("Heartbeat = True");
    }

};*/
