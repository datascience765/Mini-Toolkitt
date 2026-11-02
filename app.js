(function(){
var $=function(id){return document.getElementById(id)};
var root=document.documentElement;
$('theme').addEventListener('click',function(){
  var n=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=n;
  try{localStorage.setItem('mt-theme',n)}catch(e){}
});
function copy(text,el,label){
  var ok=function(){el.textContent=label+' copied.';setTimeout(function(){el.textContent=''},2000)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok,function(){el.textContent='Copy failed. Select the text and copy it manually.'})}
  else{el.textContent='Copy is not supported here. Select the text and copy it manually.'}
}
if($('wc-in')){
  $('wc-in').addEventListener('input',function(){
    var t=this.value,w=t.trim()?t.trim().split(/\s+/).length:0;
    $('s-w').textContent=w;$('s-c').textContent=t.length;
    $('s-n').textContent=t.replace(/\s/g,'').length;
    $('s-s').textContent=(t.match(/[^.!?۔؟]+[.!?۔؟]+|[^.!?۔؟]+$/g)||[]).filter(function(s){return s.trim()}).length;
    $('s-r').textContent=w?Math.max(1,Math.round(w/200)):0;
  });
}
if($('cs-in')){
  var cases={
    upper:function(s){return s.toUpperCase()},
    lower:function(s){return s.toLowerCase()},
    title:function(s){return s.toLowerCase().replace(/(^|\s)(\S)/g,function(m,a,b){return a+b.toUpperCase()})},
    sentence:function(s){return s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\S)/g,function(m,a,b){return a+b.toUpperCase()})},
    slug:function(s){return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/[\s-]+/g,'-').replace(/^-|-$/g,'')}
  };
  [].forEach.call(document.querySelectorAll('[data-case]'),function(b){
    b.addEventListener('click',function(){$('cs-in').value=cases[b.dataset.case]($('cs-in').value);$('cs-msg').textContent=''});
  });
  $('cs-copy').addEventListener('click',function(){
    if(!$('cs-in').value){$('cs-msg').textContent='Nothing to copy yet. Type some text first.';return}
    copy($('cs-in').value,$('cs-msg'),'Text');
  });
}
if($('pw-out')){
  var sets={up:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lo:'abcdefghijklmnopqrstuvwxyz',nu:'0123456789',sy:'!@#$%^&*()-_=+[]{};:,.?'};
  var rnd=function(n){var a=new Uint32Array(1),m=Math.floor(4294967296/n)*n;do{crypto.getRandomValues(a)}while(a[0]>=m);return a[0]%n};
  var gen=function(){
    var on=['up','lo','nu','sy'].filter(function(k){return $('o-'+k).checked});
    var len=+$('pw-len').value;$('pw-len-v').textContent=len;
    if(!on.length){$('pw-out').textContent='';$('pw-msg').textContent='Select at least one character type.';$('pw-bar').style.width='0';$('pw-strength').textContent='';return}
    $('pw-msg').textContent='';
    var pool=on.map(function(k){return sets[k]}).join('');
    var c=on.map(function(k){return sets[k][rnd(sets[k].length)]});
    while(c.length<len)c.push(pool[rnd(pool.length)]);
    for(var i=c.length-1;i>0;i--){var j=rnd(i+1),t=c[i];c[i]=c[j];c[j]=t}
    $('pw-out').textContent=c.join('');
    var bits=Math.round(len*Math.log2(pool.length));
    $('pw-bar').style.width=Math.min(100,bits/1.28)+'%';
    $('pw-strength').textContent=(bits<50?'Weak':bits<80?'Good':bits<110?'Strong':'Very strong')+' (about '+bits+' bits)';
  };
  ['pw-len','o-up','o-lo','o-nu','o-sy'].forEach(function(id){$(id).addEventListener('input',gen)});
  $('pw-gen').addEventListener('click',gen);
  $('pw-copy').addEventListener('click',function(){
    var v=$('pw-out').textContent;
    if(!v){$('pw-msg').textContent='Generate a password first.';return}
    copy(v,$('pw-msg'),'Password');
  });
  gen();
}
})();
