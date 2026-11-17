
(function(){
  var TZ='America/Los_Angeles', GUEST='jack@ballast.la', INVITE='jack@ballast.la', DUR=30;
  var SLOTS=['09:00','09:30','10:00','10:30','11:00','13:00','13:30','14:00','14:30','15:00'];
  var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DOWS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var today=new Date(); today.setHours(0,0,0,0);
  var view=new Date(today.getFullYear(),today.getMonth(),1);
  var maxMonth=new Date(today.getFullYear(),today.getMonth()+3,1);
  var day=null, slot=null;
  var $=function(id){return document.getElementById(id)};
  var days=$('calDays'),title=$('calTitle'),prev=$('calPrev'),next=$('calNext'),slots=$('calSlots'),pick=$('calPick'),local=$('calLocal'),m=$('calMail');
  function pad(n){return (n<10?'0':'')+n}
  function key(d){return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())}
  function bookable(d){var w=d.getDay();return d>=today&&w!==0&&w!==6}
  function renderMonth(){
    title.textContent=MONTHS[view.getMonth()]+' '+view.getFullYear();
    prev.disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);
    next.disabled=view>=maxMonth;
    days.innerHTML='';
    var first=(view.getDay()+6)%7;
    for(var i=0;i<first;i++){var e=document.createElement('span');days.appendChild(e)}
    var n=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();
    for(var d=1;d<=n;d++){
      var dt=new Date(view.getFullYear(),view.getMonth(),d);
      var b=document.createElement('button');b.type='button';b.className='day';b.textContent=d;
      if(!bookable(dt))b.disabled=true;
      if(key(dt)===key(today))b.classList.add('is-today');
      if(day&&key(dt)===key(day))b.classList.add('is-on');
      (function(dt){b.addEventListener('click',function(){day=dt;renderMonth();renderSlots();update()})})(dt);
      days.appendChild(b);
    }
  }
  function renderSlots(){
    slots.innerHTML='';
    SLOTS.forEach(function(s){
      var b=document.createElement('button');b.type='button';b.className='slot'+(s===slot?' is-on':'');
      if(day&&key(day)===key(today)){var nowPT=new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()).split(':');if((+s.slice(0,2))*60+ +s.slice(3)<(+nowPT[0]%24)*60+ +nowPT[1]+120){b.disabled=true;if(s===slot)slot=null}}
      var h=+s.slice(0,2),mi=s.slice(3);b.textContent=((h+11)%12+1)+':'+mi+(h<12?' am':' pm');
      b.addEventListener('click',function(){slot=s;renderSlots();update()});
      slots.appendChild(b);
    });
  }
  function fmtLocal(dateStr,timeStr){
    try{
      var probe=new Date(dateStr.slice(0,4)+'-'+dateStr.slice(4,6)+'-'+dateStr.slice(6,8)+'T'+timeStr+':00Z');
      var laParts=new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(probe);
      var laH=+laParts.find(function(p){return p.type==='hour'}).value%24,laM=+laParts.find(function(p){return p.type==='minute'}).value;
      var offset=(laH*60+laM)-(+timeStr.slice(0,2)*60+ +timeStr.slice(3));
      if(offset>720)offset-=1440;if(offset<-720)offset+=1440;
      var real=new Date(probe.getTime()-offset*60000);
      var here=Intl.DateTimeFormat().resolvedOptions().timeZone;
      if(here===TZ)return '';
      return 'That is '+new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(real)+' where you are.';
    }catch(e){return ''}
  }
  var nameI=$('calName'),mailI=$('calEmail'),coI=$('calCo'),book=$('calBook'),form=$('calForm'),note=$('calNote'),timeI=$('calTime');
  var pretty='',st='',en='';
  function ready(){book.disabled=!(day&&slot&&nameI.value.trim()&&mailI.checkValidity()&&mailI.value.trim())}
  function update(){
    if(!day){pick.textContent='Pick a day.';local.innerHTML='&nbsp;';ready();return}
    var label=DOWS[day.getDay()]+' '+day.getDate()+' '+MONTHS[day.getMonth()].slice(0,3);
    if(!slot){pick.textContent=label+'. Pick a time.';local.innerHTML='&nbsp;';ready();return}
    var h=+slot.slice(0,2),mi=slot.slice(3);
    pretty=label+', '+((h+11)%12+1)+':'+mi+(h<12?' am':' pm')+' PT';
    pick.textContent=pretty;
    var dk=key(day);st=dk+'T'+slot.replace(':','')+'00';
    var endMin=h*60+ +mi+DUR;en=dk+'T'+pad(Math.floor(endMin/60))+pad(endMin%60)+'00';
    timeI.value=pretty;
    m.href='mailto:'+GUEST+'?subject='+encodeURIComponent('Ballast call — '+pretty)+'&body='+encodeURIComponent('Hi Jack,\n\nI would like to book a call: '+pretty+'.\n\n');
    local.textContent=fmtLocal(dk,slot)||' ';
    ready();
  }
  [nameI,mailI].forEach(function(i){i.addEventListener('input',ready)});
  function ics(who,co,mail){
    var uid=st+'-'+Math.random().toString(36).slice(2)+'@ballast.la';
    var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ballast//Booking//EN','METHOD:PUBLISH','BEGIN:VEVENT','UID:'+uid,
      'DTSTART;TZID='+TZ+':'+st,'DTEND;TZID='+TZ+':'+en,'SUMMARY:Jack @ Ballast + '+who,
      'DESCRIPTION:30 minutes with Jack at Ballast. Booked from ballast.la.','ORGANIZER;CN=Jack @ Ballast:mailto:'+INVITE,
      'ATTENDEE;CN='+who+':mailto:'+mail,'END:VEVENT','END:VCALENDAR'];
    return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(lines.join('\r\n'));
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();if(book.disabled)return;
    var who=nameI.value.trim(),co=coI.value.trim(),mail=mailI.value.trim();
    book.disabled=true;book.textContent='Booking…';
    var data={name:who,email:mail,company:co,time:pretty,offer:$('calOfferIn').value||'',_subject:'Jack @ Ballast + '+who+' — '+pretty,_replyto:mail,_template:'table',_captcha:'false'};
    function fs(to){return fetch('https://formsubmit.co/ajax/'+to,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)}).then(function(r){return r.json()}).then(function(j){return j&&(j.success===true||j.success==='true')}).catch(function(){return false})}
    var nf=fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()}).then(function(r){return r.ok}).catch(function(){return false});
    var sent=Promise.all([fs('jack@ballast.la'),fs('24f0c58813f0d78cbaba156155b91734'),nf]).then(function(r){return r[0]||r[1]||r[2]});   // booked if any of the three takes it
    var gUrl='https://calendar.google.com/calendar/render?action=TEMPLATE'
      +'&text='+encodeURIComponent('Jack @ Ballast + '+who)
      +'&dates='+st+'/'+en+'&ctz='+encodeURIComponent(TZ)
      +'&details='+encodeURIComponent('30 minutes with Jack at Ballast. Booked from ballast.la.\n\n'+who+(co?' · '+co:'')+' · '+mail)
      +'&add='+encodeURIComponent(INVITE);
    sent.then(function(ok){
      if(!ok){   // nothing took it: hand the visitor a ready-to-send email so the booking still reaches Jack
        var mt='mailto:jack@ballast.la?subject='+encodeURIComponent('Ballast call — '+who+' — '+pretty)+'&body='+encodeURIComponent('Hi Jack,\n\nBooking a call: '+pretty+'.\n\n'+who+(co?' · '+co:'')+' · '+mail+($('calOfferIn').value?'\nRedeeming: '+$('calOfferIn').value:'')+'\n');
        form.innerHTML='<p class="cal__done">One last tap: send this email and your '+pretty+' slot is locked in.</p><div class="cal__adds"><a class="btn btn--lg" href="'+mt+'">Send the booking email</a><a class="btn btn--ghost" target="_blank" rel="noopener" href="'+gUrl+'">Add to Google Calendar</a></div>';
        note.innerHTML='Our booking service didn&rsquo;t answer, so this goes straight to jack@ballast.la.';return}
      form.innerHTML='<p class="cal__done">You&rsquo;re booked: '+pretty+'.<br>Jack will send the invite to '+mail.replace(/</g,'&lt;')+'.</p>'
        +'<div class="cal__adds"><a class="btn btn--ghost" target="_blank" rel="noopener" href="'+gUrl+'">Add to Google Calendar</a><a class="btn btn--ghost" download="ballast-call.ics" href="'+ics(who,co,mail)+'">Add to Apple or Outlook</a></div>';
      note.innerHTML='Questions before then? <a href="mailto:jack@ballast.la">jack@ballast.la</a>';
    });
  });
  prev.addEventListener('click',function(){view=new Date(view.getFullYear(),view.getMonth()-1,1);renderMonth()});
  next.addEventListener('click',function(){view=new Date(view.getFullYear(),view.getMonth()+1,1);renderMonth()});
  renderMonth();renderSlots();update();
})();
