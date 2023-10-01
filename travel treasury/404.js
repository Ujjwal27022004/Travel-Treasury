(function(){
    window.onload = function(){
       var ct;
       var canvas = document.getElementById('c');
       ct = new Centi('ct');
       ct.init(canvas, null);
       ct.setupFunc = init;
       ct.drawFunc = draw;
       ct.start();
    
       requestAnimationFrame(update);
    
       function init(){
          ct.sz(1,1);
          ct.bg(0);
          ct.strk();
    
       }
       function draw(){
         var w = window.innerWidth;
         var h = window.innerHeight;
          ct.crash(1);
          ct.col(255);
          ct.lineWidth(2);
         
           //first four
           ct.line(w/3.3,h/3,w/3.3,h/2);
           ct.line(w/3.3, h/2, w/2.45, h/2.1);
           ct.line(w/2.6, h/3, w/2.6, h/1.5);
           //the zero
           ct.rect(w/2.25, h/3, w/8, h/3);
           //second four
           ct.line(w/1.60, h/3, w/1.60, h/2)
           ct.line(w/1.60, h/2, w/1.38, h/2.1);
           ct.line(w/1.40, h/3, w/1.40, h/1.5);
       }
    
       function update(){
           requestAnimationFrame(update);
           ct.update();
       }
    
       if ( window.addEventListener ) {
           window.addEventListener('resize', onResize, false);
       } else if ( window.onresize ) {
           window.onresize = onResize;
       }
    
       function onResize(){
           ct.size(ct.sizeW, ct.sizeH);
       }
    };
    })();