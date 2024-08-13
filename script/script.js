"use strict"

let sfHosted;
let sid;
let orgTime;

const getTime = async ()  =>{
  let dt = new Date();
  dt = dt.toLocaleString("en-US", { timeZone: `${orgTime}` });
  return dt;
}

function createTime() {
  let h1 = document.querySelector('#dt-inspect');
  if (!h1) {
    let bd = document.querySelector('body');
    let orgTimeSlot = document.createElement('div');
    orgTimeSlot.setAttribute('id', 'dt-inspect');
    orgTimeSlot.classList.add('slds-button','slds-button_outline-brand','slds-text-title_bold'); // Add the class name

    // Set styles
    orgTimeSlot.style.zIndex = '1000';
    orgTimeSlot.style.position = 'fixed';
    orgTimeSlot.style.top = '2rem';
    orgTimeSlot.style.right = '-21rem';
    orgTimeSlot.style.transition = 'right 1s ease-in-out';

    // Handle hover effect
    orgTimeSlot.addEventListener('mouseover', () => {
      orgTimeSlot.style.right = '1rem';
    });

    orgTimeSlot.addEventListener('mouseout', () => {
      orgTimeSlot.style.right = '-21rem';
    });

    setInterval(async  () => {
      orgTimeSlot.innerHTML = `<span>${orgTime}&nbsp;</span><span>${await getTime()}</span>`; // Display the localized date and time
    }, 1000);
    bd.appendChild(orgTimeSlot);
  }
}

if (document.querySelector("body.sfdcBody, body.ApexCSIPage, #auraLoadingBox") || location.host.endsWith("visualforce.com")) {
  // We are in a Salesforce org
  chrome.runtime.sendMessage({ message: "getSfHost", url: location.href }, sfHost => {
    if (sfHost) {
      sfHosted = sfHost;
      chrome.runtime.sendMessage({ message: "getSession", sfHost: sfHost }, async cookie => {
        sid = cookie.key;
        await sfConnect();
        await createTime();
      })
    }
  });
  
  async function sfConnect() {
    await fetch(`https://${sfHosted}/services/data/v60.0/query/?q=SELECT%20TimeZoneSidKey%20FROM%20Organization`, {
      method: 'GET',
      headers: {
        "Authorization": 'Bearer ' + sid,
        Accept: '*/*',
        Host: 'peo.my.salesforce.com',
        'Accept-Encoding': 'gzip, deflate, br',
      }
    }).then( async response => {
      let data = await response.json();
      orgTime = data.records[0].TimeZoneSidKey;
    })
  }

}