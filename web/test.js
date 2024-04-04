/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/* ------------[LAST UPDATE 2005/02/24 22:51]--------------------
   Remote Scripting library using javascript only.
   Replacement for xmlhttp, which doesn't like NT4.
   I don't like NT4 for that, but hey, a lot of people
   still (have to) use it. No iframes, no MsJava.
   You'll need a ASP/CGI/any server side program
   returning javascript, the last statement being
   the return function. 
   Tested in Firefox 1.0/IE/Opera (7.5, 8 beta). All 
   working. 
   
   You may use this code as you need it, but do leave 
   the authors name somewhere in it please. Thanks.
   (c) 2005-3010 Renzo Kooi/NICon
   -------------------------------------------------------------*/
RSL          = RSL;
gbAppend     = false;
defStat      = RSL_setStat;
remoteApp    = '';
allowHTML    = false;
noStatChange = false;
goRS         = new Object();

function RSL()
{

  if (arguments.length<1)
  { this.result = 'ERROR: no query string provided!';
    alert(this.result);
    return false
  }

  if (!remoteApp || remoteApp == '')
  { this.result = 'ERROR: remote app unknown!\n'
                  +'Please supply the path of the remote\n'
                  +'application this object should use\n'
                  +'either in this object file or in the\n'
                  +'additional client scripting';
    alert(this.result);
    return false
  }

   
   this.oQ           = arguments[0];

   //** test if exit function is defined and assign it if so
   var oExTest       = this.oQ.callback;
    if (!String(oExTest).match(/undef|null/))
     if ( (String(typeof oExTest).match(/funct|obj/i)))
      this.exit      = oExTest;
    else
     this.exit       = function() {return true};

   var sQNow         = new RSL_ComposeQuery(this.oQ);
   this.sSrc         = remoteApp+'?'+sQNow.sQ;
   this.initScr      = RSL_setScript;


   this.dispatch     = RSL_dispatchMOZ;
}

function RSL_setScript()
{
   var tScript    = document.createElement('script');
   tScript.id     = 'remotejs';
   tScript.defer  = true;
   tScript.onload = function(){return true};
   tScript.setAttribute('src',this.sSrc);

   if (!gbAppend)
   {
    //** first time loading, creating a container for the script
    //** and appending the script element to it
    var oRemote = document.createElement('div');
    oRemote.id  = 'remote';
    document.body.appendChild(oRemote);
    document.getElementById('remote').appendChild(tScript);
    gbAppend    = true;
   }
   else
   { //** let's not create a cloud of scripts here
     var oRDiv = document.getElementById('remote');
     oRDiv.removeChild(oRDiv.firstChild);
     //** re-append the just renewed script
     oRDiv.appendChild(tScript);
   }
 }

function RSL_ComposeQuery(oArgs)
{
  var aWrk  = new Array();
  var sT = '';
  for (var i in oArgs)
   if (i != 'callback')
   { var sArg = oArgs[i].replace(/\+/g,'&#43;');
     if (!allowHTML)
     {
       sArg = sArg.replace(/</g,'&lt;');
       sArg = sArg.replace(/>/g,'&gt;');
     }
    aWrk.push(i+'='+encodeURIComponent(sArg))
   }

  this.sQ = aWrk.join('&');
}

function RSL_dispatchMOZ(sStat)
{ 
  if (String(navigator.userAgent).match(/gecko/i))
  {
   var oDisp = document.getElementById('Moz_Dispatcher');
   if (sStat && !noStatChange)
    oDisp.onload=function(){top.defStat(sStat)}
   oDisp.src=''; return
  }
  else if (sStat && !noStatChange)
   defStat(sStat);

 return
}

function RSL_setStat(sTxt)
{
  window.defaultStatus = sTxt;
} 

defStat('-');
remoteApp = 'https://www.careerjet.com.my/partners/remote.html';

function doSearch(pagesize , offset ){
    var what = document.getElementById('what').value ;
    var where = document.getElementById('where').value ;
    var s = what ;
    s.replace('%20' , '+' );
    var l = where ;
    l.replace('%20', '+' ) ;
    var lid = document.getElementById('cjlid').value ;
    var base = document.getElementById('cjbase').value ;
    var affid = document.getElementById('cjaffid').value ;
    var rkws = document.getElementById('cjrkws').value ;

    s += ' ' + rkws ;

    var cf   = document.getElementById('cjcf').value ;
    
    goRS = new RSL( {'call':'search',
			    'pagesize': ''+ pagesize + '' ,
			    'offset'  : '' + offset + '' ,
			    's': '' + s + '' ,
			    'l': '' + l + '' ,
                            'c': '' + cf + '' ,
			    'lid': '' + lid + ''  ,
                            'base' : '' + base + '' ,
                            'affid' : '' + affid + '' ,
			    'callback' :ShowRes});
    return goRS.initScr() ;
}

function cleanLid(){
   document.getElementById('cjlid').value="" ;
}

function ShowRes(){
    var sR = unescape(goRS.result); 
    document.getElementById('cjSearchResult').innerHTML = sR;
}