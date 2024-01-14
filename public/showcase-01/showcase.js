let firstRun = true;


const executeAction = (eventName, detail) =>
{
    console.log("eventName = " + eventName);

    var game01Frame = document.getElementById("game-01-frame");
    var game02Frame = document.getElementById("game-02-frame");

    if (game01Frame != null)
        game01Frame.contentWindow.dispatchEvent(new CustomEvent(eventName, { detail }));

    if (game02Frame != null)
        game02Frame.contentWindow.dispatchEvent(new CustomEvent(eventName, { detail }));
}

const TryToFocusGames = () =>
{
    var game01Frame = document.getElementById("game-01-frame");
    var game02Frame = document.getElementById("game-02-frame");

    if (game01Frame != null)
        game01Frame.contentWindow.focus();

    if (game02Frame != null)
        game02Frame.contentWindow.focus();
}

async function DefaultLoop0SButton()
{
    DefaultLoop(0);
}

async function DefaultLoop1SButton()
{
    DefaultLoop(1);
}

async function DefaultLoop2SButton()
{
    DefaultLoop(2);
}

async function DefaultLoop5SButton()
{
    DefaultLoop(5);
}

async function DefaultLoop15SButton()
{
    DefaultLoop(15);
}

async function TestWheelie500ms()
{
    executeAction('test-wheelie', { durationInMs: 500 })
}


async function DefaultLoop(durationSeconds)
{
    let timeout = 2;
    let multiplier = 1;
    let timeElapsed = 0;

    UpdateMultiplier(1, 1);

    while (timeElapsed < durationSeconds)
    {
        await Delay(1);
        timeElapsed += 1;
        multiplier += 1;
        UpdateMultiplier(multiplier, multiplier);
    }

    DoCrash();
}

async function Delay(waitSeconds)
{
    await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
}


function UpdateMultiplier(multiplier, interval)
{
    // executeAction('start', { color: 'rgb(52, 180, 255)' })

    if (firstRun)
    {
        executeAction('start', { color: 'rgb(52, 180, 255)' })
        // crashMultiplier.update({
        //     multiplier: +multiplier,
        //     gameStatus: GameStatus.RUNNING,
        // })

        // crashMultiplier.smoothIncrement()
        firstRun = false
    }

    executeAction('odds', { multi: multiplier })

    ////INICIO DE MARCACAO - VAI SER TIRADO DAQUI PRA BAIXO NA VERSAO FINAL

    if (multiplier < 2)
    {
        executeAction('oddColor', { color: 'rgb(52, 180, 255)' })
    } else if (multiplier > 2 && multiplier < 6)
    {
        executeAction('oddColor', { color: 'rgb(145, 62, 248)' })
        //Change pose on Motograu V2
        executeAction('increaseOdd', { multiplier: 3 })
    } else if (multiplier > 6 && multiplier < 26)
    {
        executeAction('oddColor', { color: 'rgb(192, 23, 180)' })
        //Change pose on Motograu V2
        executeAction('increaseOdd', { multiplier: 11 })
    } else
    {
        executeAction('oddColor', { color: 'rgb(12, 200, 10)' })
    }
}

function DoCrash()
{
    executeAction('crash', { color: 'rgb(52, 180, 255)' });
    firstRun = true;
}

window.addEventListener('load', function ()
{
    TryToFocusGames();
})

