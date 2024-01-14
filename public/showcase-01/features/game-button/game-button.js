let currentGameButton = null;
let gameButtonsById = {};
let allColorsClassesList =
    [
        "sprite-color-light-red",
        "sprite-color-dark-red",
        "sprite-color-light-orange",
        "sprite-color-dark-orange",
        "sprite-color-light-green",
        "sprite-color-dark-green",
    ];

export function ResetState()
{
    // currentGameButton = null;
    gameButtonsById = {};

    let gameButtonsList = document.getElementsByClassName('game-button');

    for (let i = 0; i < gameButtonsList.length; i++)
    {
        let gameButton = gameButtonsList[i];

        let gameButtonRandomId = "game-button-" + Math.random();
        gameButton.id = gameButtonRandomId;

        let mainButton = gameButton.querySelector('.main-button');
        let contentContainer = gameButton.querySelector('.content-container');
        let borderSprite = gameButton.querySelector('.border-sprite');
        let centerSprite = gameButton.querySelector('.center-sprite');
        mainButton.id = gameButtonRandomId;

        let gameButtonObject =
        {
            Id: gameButtonRandomId,

            RootElement: gameButton,
            MainButton: mainButton,
            ContentContainer: contentContainer,
            BorderSprite: borderSprite,
            CenterSprite: centerSprite,
        }

        mainButton.onmousedown = () => OnButtonHoldDown(gameButtonObject);
        gameButtonsById[gameButtonRandomId] = gameButtonObject;

        // SetLightRedColorToButton(gameButtonRandomId);
        // SetDarkRedColorToButton(gameButtonRandomId);
        // SetLightOrangeColorToButton(gameButtonRandomId);
        // SetDarkOrangeColorToButton(gameButtonRandomId);
        // SetLightGreenColorToButton(gameButtonRandomId);
        // SetDarkGreenColorToButton(gameButtonRandomId);
    }
}

function UnpressAllButtons()
{
    OnButtonHoldUp
}

export function HandleMouseUpEvent(event)
{
    console.log(event); // TODO: REVIEW THIS!
}

function OnMouseUp()
{
    if (currentGameButton != null)
        OnButtonHoldUp(currentGameButton);

    currentGameButton = null;

    UnpressAllButtons();
}

function OnButtonHoldDownById(buttonId)
{
    let gameButtonObject = gameButtonsById[buttonId];
    OnButtonHoldDown(gameButtonObject);
}

function OnButtonHoldDown(gameButtonObject)
{
    currentGameButton = gameButtonObject;
    ApplyPressedSpriteToButton(gameButtonObject);
}

function OnButtonHoldUpById(buttonId)
{
    ApplyUnpressedSpriteToButtonById(buttonId);
}

function OnButtonHoldUp(gameButtonObject)
{
    ApplyUnpressedSpriteToButton(gameButtonObject);
}

function ApplyPressedSpriteToButtonById(buttonId)
{
    let gameButtonObject = gameButtonsById[buttonId];

    if (gameButtonObject != null)
        ApplyPressedSpriteToButton()
}

function ApplyPressedSpriteToButton(gameButtonObject)
{
    if (gameButtonObject != null)
    {
        gameButtonObject.ContentContainer.classList.add("content-container-pressed");
        gameButtonObject.BorderSprite.classList.add("border-sprite-pressed");
        gameButtonObject.CenterSprite.classList.add("center-sprite-pressed");
    }
}

function ApplyUnpressedSpriteToButtonById(buttonId)
{
    let gameButtonObject = gameButtonsById[buttonId];
    ApplyUnpressedSpriteToButton(gameButtonObject);
}

function ApplyUnpressedSpriteToButton(gameButtonObject)
{
    if (gameButtonObject != null)
    {
        gameButtonObject.ContentContainer.classList.remove("content-container-pressed");
        gameButtonObject.BorderSprite.classList.remove("border-sprite-pressed");
        gameButtonObject.CenterSprite.classList.remove("center-sprite-pressed");
    }
}

// region Colors
function SetLightRedColorToButton(buttonId)
{
    SetColorToButton(buttonId, "sprite-color-light-red");
}

function SetDarkRedColorToButton(buttonId)
{
    SetColorToButton(buttonId, "sprite-color-dark-red");
}

function SetLightOrangeColorToButton(buttonId)
{
    SetColorToButton(buttonId, "sprite-color-light-orange");
}

function SetDarkOrangeColorToButton(buttonId)
{
    SetColorToButton(buttonId, "sprite-color-dark-orange");
}

function SetLightGreenColorToButton(buttonId)
{
    SetColorToButton(buttonId, "sprite-color-light-green");
}

function SetDarkGreenColorToButton(buttonId)
{
    SetColorToButton(buttonId, "sprite-color-dark-green");
}

function SetColorToButton(buttonId, colorClass)
{
    let gameButtonObject = gameButtonsById[buttonId];

    if (gameButtonObject != null)
    {
        RemoveAllColors(gameButtonObject.BorderSprite);
        RemoveAllColors(gameButtonObject.CenterSprite);

        gameButtonObject.BorderSprite.classList.add(colorClass);
        gameButtonObject.CenterSprite.classList.add(colorClass);
    }
}

function RemoveAllColors(baseElement)
{
    if (baseElement != null)
    {
        allColorsClassesList.map(
            (colorClass) =>
                baseElement.classList.remove(colorClass));
    }
}

// region Events
window.addEventListener('mouseup', OnMouseUp, false);


ResetState();
