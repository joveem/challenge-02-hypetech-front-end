let resizablesControllersList = document.getElementsByClassName('resizable-controller');

let currentResizerTrigger = null;
let triggerDictionary = {};
let containerDictionary = {};

for (let i = 0; i < resizablesControllersList.length; i++)
{
    let resizableContainer = resizablesControllersList[i];

    let resizerTrigger = document.createElement('div');
    resizableContainer.appendChild(resizerTrigger);
    resizerTrigger.resizableContainer = resizableContainer;

    let triggerRandomId = "trigger-" + Math.random();
    resizerTrigger.id = triggerRandomId;
    triggerDictionary[triggerRandomId] = resizerTrigger;
    containerDictionary[triggerRandomId] = resizableContainer;

    resizerTrigger.className = 'resizer';
    resizerTrigger.style.width = '10px';
    resizerTrigger.style.height = '10px';
    resizerTrigger.style.background = '#f1f';
    resizerTrigger.style.position = 'absolute';
    resizerTrigger.style.right = 0;
    resizerTrigger.style.bottom = 0;
    resizerTrigger.style.cursor = 'se-resize';
    resizerTrigger.style.zIndex = 10000;

    resizerTrigger.addEventListener('mousedown', initResize, false);
}


// var resizableContainer = document.getElementById('resizable-controller');
// var resizer = document.createElement('div');
// resizer.className = 'resizer';
// resizer.style.width = '10px';
// resizer.style.height = '10px';
// resizer.style.background = 'black';
// resizer.style.position = 'absolute';
// resizer.style.right = 0;
// resizer.style.bottom = 0;
// resizer.style.cursor = 'se-resize';
// resizer.style.zIndex = 10000;
// resizableContainer.appendChild(resizer);
// resizer.addEventListener('mousedown', initResize, false);

function initResize(event)
{
    currentResizerTrigger = event.target;
    window.addEventListener('mousemove', Resize, false);
    window.addEventListener('mouseup', stopResize, false);
}

function Resize(event)
{
    let resizableContainer = containerDictionary[currentResizerTrigger.id];

    resizableContainer.style.width = (event.clientX - resizableContainer.offsetLeft) + 'px';
    resizableContainer.style.height = (event.clientY - resizableContainer.offsetTop) + 'px';
}

function stopResize(event)
{
    currentResizerTrigger = null;

    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
}
