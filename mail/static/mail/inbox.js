document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#section-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose-form').onsubmit = () => {


    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        if (result.error) {
          console.log(result);
          alert('Please check credentials');
        }
        else {
          console.log(result);
          load_mailbox('sent')
        }
      });
    return false;
  };

}

function sectio(a) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#section-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  fetch(`/emails/${a}`)
    .then(response => response.json())
    .then(email => {
      let le = email.recipients.length
      let s = ""
      for (let r = 0; r < le; r++) {
        s = s + email.recipients[r] + "\xa0"
      }
      document.querySelector('#se').innerHTML = `From: ${email.sender}`;
      document.querySelector('#su').innerHTML = `Subject: ${email.subject}`;
      document.querySelector('#me').innerHTML = `Message: ${email.body}`;
      document.querySelector('#re').innerHTML = `Recipients: ${s}`;
      document.querySelector('#ti').innerHTML = `On: ${email.timestamp}`;
      if (email.archived === false) {
        document.querySelector('#arch').innerHTML = "Add to archived";
      }
      else {
        document.querySelector('#arch').innerHTML = "Remove from archived";
      }
      console.log(email);
      fetch(`/emails/${a}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
      document.querySelector('#reply').onclick = () => {
        // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#section-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  let r=0;
  if(email.subject.substring(0,3)==="Re:"){
    r=email.subject;
  }
  else{
    r="Re: "+email.subject;
  }
  let b="On "+email.timestamp+" "+email.sender+" wrote: "+email.body;
  document.querySelector('#compose-subject').value =r; 
  document.querySelector('#compose-body').value =b;
  document.querySelector('#compose-form').onsubmit = () => {


    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        if (result.error) {
          console.log(result);
          alert('Please check credentials');
        }
        else {
          console.log(result);
          load_mailbox('sent')
        }
      });
    return false;
  };

      }
      document.querySelector('#arch').onclick = () => {
        console.log(email.archived)
        if (email.archived === true) {
          fetch(`/emails/${a}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: false
            })
          })
          document.querySelector('#arch').innerHTML = "Add to archived";
        }
        else {
          fetch(`/emails/${a}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: true
            })
          })
          document.querySelector('#arch').innerHTML = "Remove from archived";
        }
      }

      // ... do something else with email ...
    });
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#section-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Displaying the contents
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails)
      let i = 0
      let m = emails.length
      console.log(m)
      for (i = 0; i < m; i++) {
        console.log("true");
        let emai = document.createElement('div');
        let se = (emails[i].sender).padEnd(25, '\xa0');
        let su = (emails[i].subject).padEnd(150, '\xa0');
        let ti = (emails[i].timestamp).padStart(25, '\xa0');
        emai.innerHTML = ((se).concat((su), (ti)));
        var att = document.createAttribute("class");
        let re = emails[i].read
        if (re === true) {
          att.value = "alert alert-dark border-dark";
        }
        else {
          att.value = "alert alert-light border-dark";
        }
        emai.setAttributeNode(att);
        let a = emails[i].id;
        console.log(a)
        emai.addEventListener('click', function () {
          console.log(`This element ${a} has been clicked! `);
          sectio(a);
        });
        document.querySelector('#emails-view').append(emai);

        // if(emails[i].read===False){
        //   pass
        // }
        // else{
        //   pass
        // }
      }

      // ... do something else with emails ...
    });
}