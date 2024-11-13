let sec = 25 * 60;
let timerIsRunning = false;
let activeTabId = null;

// Listen for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (timerIsRunning && activeTabId !== null && activeTabId !== activeInfo.tabId) {
    // Pause timer when switching to a different tab
    timerIsRunning = false;
    chrome.action.setBadgeText(
      {
        text: "Pause",
      },
      () => {}
    );
    chrome.action.setBadgeBackgroundColor(
      {
        color: "pink",
      },
      () => {}
    );
    createNotification("Timer paused - switched to different tab");
  }
  activeTabId = activeInfo.tabId;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!timerIsRunning) {
    return;
  }
  sec--;
  const minLeft = Math.floor(sec / 60) + "M";
  chrome.action.setBadgeText(
    {
      text: minLeft,
    },
    () => {}
  );
  if (sec <= 0) {
    clearAlarm('pomodoro-timer');
    createNotification("Well Done you focused well, Take a break");
    chrome.contextMenus.update("start-timer",
      {
        title: "Start Timer",
        contexts: ["all"],
      });
    chrome.action.setBadgeText(
      {
        text: "-",
      },
      () => {}
    );

    chrome.action.setBadgeBackgroundColor({
      color: "yellow"
    },
      () => {}
    );
  }
});

function createAlarm(name) {
  chrome.alarms.create(
    name,
    {
      periodInMinutes: 1 / 60,
    }
  );
}

function clearAlarm(name) {
  chrome.alarms.clear(
    name,
    (wascleared) => { console.log(wascleared); }
  );
}

function createNotification(message) {
  const opt = {
    type: "list",
    title: "QuickAction",
    message,
    items: [{ title: "QuickAction", message: message }],
    iconUrl: "icons/clock-48.png",
  };
  chrome.notifications.create(null, opt);
}

chrome.contextMenus.create({
  id: "start-timer",
  title: "Start Timer",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "reset-timer",
  title: "Reset Timer",
  contexts: ["all"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case "reset-timer":
      chrome.contextMenus.update("start-timer",
        {
          title: "Start Timer",
          contexts: ["all"],
        });
      chrome.action.setBadgeText(
        {
          text: "R",
        },
        () => {}
      );

      clearAlarm("pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({
        color: "blue"
      },
        () => {}
      );

      createNotification("Your Timer has been reset");
      timerIsRunning = false;
      sec = 0;
      activeTabId = null;
      break;

    case "start-timer":
      if (timerIsRunning) {
        chrome.action.setBadgeText(
          {
            text: "S",
          },
          () => {}
        );

        chrome.action.setBadgeBackgroundColor({
          color: "green"
        },
          () => {}
        );
        createNotification("Your Timer has stopped");
        chrome.contextMenus.update("start-timer",
          {
            title: "Start Timer",
            contexts: ["all"],
          });
        timerIsRunning = false;
        activeTabId = null;
        return;
      }
      sec = sec <= 0 ? 25 * 60 : sec;
      createNotification("Your Timer has started");
      timerIsRunning = true;
      // Store the current tab ID when starting the timer
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
          activeTabId = tabs[0].id;
        }
      });
      createAlarm("pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({
        color: "orange"
      },
        () => {}
      );
      chrome.contextMenus.update("start-timer",
        {
          title: "Stop Timer",
          contexts: ["all"],
        }
      );
      break;

    default:
      break;
  }
});

chrome.action.setBadgeBackgroundColor({
  color: "orange"
},
  () => {}
);