let sec=25*60;
let timerIsRunning=false;

chrome.alarms.onAlarm.addListener((alarm) => {
  //  console.log(++sec);
  if(!timerIsRunning){
     return;
  }
   sec--;
   const minLeft=Math.floor(sec/60)+"M";
    chrome.action.setBadgeText(
      {
               text: minLeft,
      },
    ()=>{}
    );
   if(sec<=0){
    clearAlarm('pomodoro-timer');
    createNotification("well Done you focused well, Take a break");
    chrome.contextMenus.update("start-timer",
      { title: "start Timer",
       contexts: ["all"],
      
      });

      chrome.action.setBadgeText(
        {
                 text: "-",
        },
      ()=>{}
      );

      
chrome.action.setBadgeBackgroundColor({
  color:"yellow"
},
()=>{}
);


   }
}); 


function createAlarm(name){
  chrome.alarms.create(
    name, 
    {
      periodInMinutes: 1/60,
    }
    // (alarm)=>{
    //  console.log(alarm);
    // }
  );
}

function clearAlarm(name){
  chrome.alarms.clear(
    name,
    (wascleared)=> {console.log(wascleared);
    });
}

function createNotification(message){
  const opt={
    type : "list",
    title :"QuickAction",
    message,
    items: [{title: "QuickAction",message:message}],
    iconUrl:"icons/clock-48.png",
  };

  chrome.notifications.create(null,opt);
}

chrome.contextMenus.create({
  id : "start-timer",
  title : "Start Timer",
  contexts : ["all"]
});


chrome.contextMenus.create({
  id : "reset-timer",
  title : "Reset Timer",
  contexts : ["all"]
});

chrome.contextMenus.onClicked.addListener(function(info,tab) {
    switch(info.menuItemId){
      case "reset-timer":
         chrome.contextMenus.update("start-timer",
          { title: "start Timer",
           contexts: ["all"],
          });
        chrome.action.setBadgeText(
          {
                   text: "R",
          },
        ()=>{}
        );
        
        clearAlarm("pomodoro-timer");
        chrome.action.setBadgeBackgroundColor({
        color:"blue"
       },
      ()=>{}
      );
        
        createNotification("your Timer has been reset");
        // chrome.contextMenus.update("start-timer",
        //   { title: "start Timer",
        //    contexts: ["all"],
        //   });
        timerIsRunning=false;
        sec=0;
       break;

      case "start-timer":
       if(timerIsRunning){
        // clearAlarm("Pomodoro-Timer");

        chrome.action.setBadgeText(
          {
                   text: "S",
          },
        ()=>{}
        );
        
        
        chrome.action.setBadgeBackgroundColor({
        color:"green"
       },
      ()=>{}
      );

        createNotification("your Timer has  stopped");
        chrome.contextMenus.update("start-timer",
          { title: "start Timer",
           contexts: ["all"],
          });
        timerIsRunning=false;
        return;
       }
       sec=sec<=0? 25*60:sec; 
      createNotification("your Timer has started");
      timerIsRunning=true;
      createAlarm("pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({
        color:"orange"
      },
      ()=>{}
      );
      chrome.contextMenus.update("start-timer",
       { title: "stop Timer",
        contexts: ["all"],}
      );
      break;

      default:
        break;
    }
});


// chrome.runtime.onInstalled.addListener(function(details){
//   if(details.reason=="install"){
//     chrome.action.setBadgeBackgorundColor({
//       color:"orange"
//     },
//     ()=>{}
//   );
//   }
// });

chrome.action.setBadgeBackgroundColor({
  color:"orange"
},
()=>{}
);