let firstRun = true;


const executeAction = (eventName, detail) =>
{
    // console.log("eventName = " + eventName);

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

async function AccelerationLoop0SButton()
{
    AccelerationLoop(0);
}

async function AccelerationLoop1SButton()
{
    AccelerationLoop(1);
}

async function AccelerationLoop2SButton()
{
    AccelerationLoop(2);
}

async function AccelerationLoop5SButton()
{
    AccelerationLoop(5);
}

async function AccelerationLoop15SButton()
{
    AccelerationLoop(15);
}

async function TestWheelie500ms()
{
    executeAction('test-wheelie', { durationInMs: 500 })
}


async function DefaultLoop(durationSeconds)
{
    let startCountDown = 10;
    let multiplier = 1;
    let timeElapsed = 0;
    let stepsSize = 0.01;

    while (startCountDown > 0)
    {
        await Delay(stepsSize);
        startCountDown -= stepsSize;
        startCountDown -= stepsSize;
        UpdateStartCountDown(startCountDown.toFixed(0));
    }

    await AccelerationLoop(durationSeconds);
}

async function AccelerationLoop(durationSeconds)
{
    let multiplier = 1;
    let timeElapsed = 0;
    let stepsSize = 0.01;

    UpdateMultiplier(1, 1);

    while (timeElapsed < durationSeconds)
    {
        await Delay(stepsSize);
        timeElapsed += stepsSize;
        multiplier += stepsSize;
        UpdateMultiplier(multiplier, multiplier);
    }

    DoCrash();
}

async function Delay(waitSeconds)
{
    await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
}


function UpdateStartCountDown(timeOut)
{
    executeAction('counterTime', { timeOut: timeOut })
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

