'use strict';
const livesplitCore = require('livesplit-core');


class timerObj {
    constructor(nodecg){
        const LS_TIMER_PHASE = {
          NotRunning: 0,
          Running: 1,
          Ended: 2,
          Paused: 3,
        };

        const liveSplitRun = livesplitCore.Run.new();
        liveSplitRun.pushSegment(livesplitCore.Segment.new('finish'));
        let timerLP = livesplitCore.Timer.new(liveSplitRun);
        let timerRep = nodecg.Replicant('rbr-timer');
        var single = nodecg.Replicant('singleRun');
        var delayVideo = nodecg.Replicant('delayVideo');
        var finishTimes = nodecg.Replicant('finishTimes');

        var WebSocket = require('ws');
        const https = require('https');
        var ws;
        var oldWs = "";
        var now = 0;

        if(!timerRep){
          timerRep.value = {
            time: '00:00:00',
            state: 'stopped',
            milliseconds: 0,
            timeCalc: '00:00:00',
            millisecondsCalc: 0,
            timestamp: 0,
            teamFinishTimes: {},
          };
        }

        nodecg.listenFor('rbrTimerStart', function (data, ack) {
          startTimer()
        });

        nodecg.listenFor('rbrTimerStop', function (data, ack) {
          timerRep.value.state = 'stopped';
          timerLP.pause();
        });

        nodecg.listenFor('rbrTimerReset', function (data, ack) {
          resetTimer()
        });

        function startTimer(ms){
          if (timerLP.currentPhase() === LS_TIMER_PHASE.NotRunning) {
            timerLP.start();
            console.log('[Timer] Started');
          } else {
            timerLP.resume();
            console.log('[Timer] Resumed');
          }
          if(ms){
            setGameTime(ms);
          }
          timerRep.value.state = 'running';
        }

        function resetTimerRepToDefault() {
          timerRep.value = {
            time: '00:00:00',
            state: 'stopped',
            milliseconds: 0,
            timeCalc: '00:00:00',
            millisecondsCalc: 0,
            timestamp: 0,
            teamFinishTimes: {},
          };
          timerLP.reset(false)
          console.log('[Timer] Replicant restored to default');
        }

        function setGameTime(ms) {
          if (timerRep.value.state === 'stopped') {
            livesplitCore.TimeSpan.fromSeconds(0).with((t) => timerLP.setLoadingTimes(t));
            timerLP.initializeGameTime();
          }
          livesplitCore.TimeSpan.fromSeconds(ms / 1000).with((t) => timerLP.setGameTime(t));
         // console.log(`[Timer] Game time set to ${ms}`);
        }

        function setTime(ms) {
          timerRep.value.time = msToTimeStr(ms);
          timerRep.value.milliseconds = ms;
          if(delayVideo.value){
            ms = ms - (delayVideo.value * 1000);
          }
          timerRep.value.timeCalc = msToTimeStr(ms);
          timerRep.value.millisecondsCalc = ms;
        }

        function msToTimeStr(ms) {
          var neg = false;
          if(ms<0){
            ms = -ms;
            neg = true;
          }
          const seconds = Math.floor((ms / 1000) % 60);
          const minutes = Math.floor((ms / (1000 * 60)) % 60);
          const hours = Math.floor(ms / (1000 * 60 * 60));
          return `${neg?"-":""}${padTimeNumber(hours)}:${padTimeNumber(minutes)}:${padTimeNumber(seconds)}`;
        }
        
        function padTimeNumber(num) {
          return num.toString().padStart(2, '0');
        }

        function tick() {
          
          //console.log('[Timer]',timerRep.value.state);
          if (timerRep.value.state === 'running') {
            // Calculates the milliseconds the timer has been running for and updates the replicant.
            if (timerLP.currentPhase() === LS_TIMER_PHASE.Running) {
              timerLP.resume();
            }
            const time = timerLP.currentTime().gameTime();
            //console.log('[Timer]',timerLP.currentTime());
            if(time){
              const ms = Math.floor((time.totalSeconds()) * 1000);
              setTime(ms);
              timerRep.value.timestamp = Date.now();  
            }else{
              setGameTime(0);
              timerRep.value.timestamp = Date.now();  
            }
          }
        }

        async function resetTimer() {
          try {
            resetTimerRepToDefault();
            console.log('[Timer] Reset');
          } catch (err) {
            console.log('[Timer] Cannot reset timer:', err);
            throw err;
          }
        }
        
        function getInfo(url){
          return new Promise((res,rej)=>{
            if(url){
              url = url.replace("https://","");
              url = url.replace("racetime.gg/","");     
              var jogo = url.split("/")[0];             
              url = url.split("/")[1];   
              var dataURL = "https://racetime.gg/"+jogo+"/"+url+"/data";
              
              https.get(dataURL, resp => {
                let data = '';
                resp.on('data', (chunk) => {
                  data += chunk;
                });
                resp.on('end', () => {
                  try{
                    let fullData = JSON.parse(data);
                    res(fullData);
                  }catch(err){
                    console.log('Error: ', err.message);
                  }
                });
              }).on('error', err => {
                console.log('Error: ', err.message);
              });
            }else{
              rej("sem racetime");
            }
          });
        }

        function setup(url){
          if(url){
            url = url.replace("https://","");
            url = url.replace("racetime.gg/","");     
            var jogo = url.split("/")[0];             
            url = url.split("/")[1];   
            var dataURL = "https://racetime.gg/"+jogo+"/"+url+"/data";
            console.log('Baixando dados: ', dataURL);
            
            https.get(dataURL, resp => {
              let data = '';
              resp.on('data', (chunk) => {
                data += chunk;
              });
              resp.on('end', () => {
                try{
                  let fullData = JSON.parse(data);
                  var ws = fullData.websocket_url;
                  connetRtWs(ws)
                }catch(err){
                  console.log('Error: ', err.message);
                }
              });
            }).on('error', err => {
              console.log('Error: ', err.message);
            });
          }
        }

        function getFromRT(data){
          //  websocket_url
          var status = data.status.value;
          getFinishTimes(data);
          var delay = getDelay(data.start_delay) * 1000;

          var start =  (data.started_at ? new Date(data.started_at): now).getTime();
          var finish = (data.ended_at ? new Date(data.ended_at) : now).getTime();

          var seconds = (finish - start);

          switch(status){
            case "open" :
              timerRep.value.state = 'stopped';
              setTime(seconds - delay);
              setGameTime(seconds - delay);
              break;
            case "in_progress" :
              if(seconds - delay >= 0){
                startTimer(seconds);
                setGameTime(seconds);
              }else{
                startTimer();
              }
              break;
            case "finished" :
              timerRep.value.state = 'stopped';
              setTime(seconds);
              setGameTime(seconds);
              break;
            default:
              setTime(seconds);
              setGameTime(seconds);
          }

        }

        function getFinishTimes(data){
          var entrants = data.entrants;
          var include = [];

          entrants.forEach((runner)=>{
            var s = single.value.players.find(e=>{return e.name == runner.user.name});
            if(s){
              include.push(
                {name:runner.user.name,
                  twitch:s.twitch!=""?s.twitch:s.stream,
                  finishTime:replaceTime(runner.finish_time),
                  finished_at:runner.finished_at})
            }
          })
          var sorted = include.sort((a,b)=>{return a.finished_at - b.finished_at})

          finishTimes.value = sorted;
        }

        function replaceTime(text){
          var final = "DNF"
          if(text){
            var h = text.split("T")[1].split("H")[0];
            var m = text.split("H")[1].split("M")[0];
            var s = text.split("M")[1].split("S")[0];
            final = h+":"+m+":"+s;
          }
          return final;
        }

        function connetRtWs(url){
          if(ws != undefined){
            try{
              ws.close()
            }
            catch(e){
              console.log(e)
            }

          }
          setTimeout(()=>{
            oldWs = "wss://racetime.gg" + url;
            ws = new WebSocket(oldWs);
            ws.on('open', function() {
                console.log('connected to:'+oldWs);
            });
            ws.on('message', function(data, flags) {
              try{
                let fullData = JSON.parse(data);
                now = new Date(fullData.date);
                if(fullData.type == "race.data"){
                  getFromRT(fullData.race)
                }
              }catch(err){
                console.log('Error: ', err.message);
              }
            })
          }, 1000);
        }

        function getDelay(delay){
          //P0DT00H00M15S
          delay = delay.replace("P","");
          var days = parseInt(delay.split("DT")[0]);
          var hours = parseInt(delay.split("DT")[1].split("H")[0]) + (days * 24);
          var minutes = parseInt(delay.split("H")[1].split("M")[0]) + (hours * 60);
          var seconds = parseInt(delay.split("M")[1].split("S")[0]) + (minutes * 60);

          return seconds;
        }

        nodecg.listenFor('getRT', function (data, ack) {
          var url = data.url;
          getInfo(url).then((data)=>{
            if (ack && !ack.handled) {
              ack(data)
            }
          });
        });

        nodecg.listenFor('rbrReloadRT', function (data, ack) {
          setup(single.value.racetime);
        });

        single.on("change",(newval,oldval)=>{    
          if(newval != oldval){
            var url = newval.racetime;
            setup(url)
          }
        });

        setInterval(tick, 100);

    }
}

module.exports = timerObj;