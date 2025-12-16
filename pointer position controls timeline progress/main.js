const tl = gsap.timeline({
    defaults:{
      duration:2,
      yoyo:true,
      ease:'power2.inOut'
    }
  })
  .fromTo('.left, .right', {
    svgOrigin:'640 500',
    skewY:(i)=>[-30,15][i],
    scaleX:(i)=>[0.6,0.85][i],
    x:200
  },{
    skewY:(i)=>[-15,30][i],
    scaleX:(i)=>[0.85,0.6][i],  
    x:-200
  })
  .play(.5)
  
  const tl2 = gsap.timeline()
  
  document.querySelectorAll('text').forEach((t,i)=>{
    tl2.add(
      gsap.fromTo(t, {
        xPercent:-100,
        x:700
      }, {
        duration:1,
        xPercent:0,
        x:575,
        ease:'sine.inOut'
      })
      , i%3*0.2)
  })
  
  
  
  window.onpointermove = (e)=>{
    tl.pause()
    tl2.pause()
    gsap.to([tl,tl2], {
      duration: 2,
      ease: 'power4',
      progress: e.x/innerWidth
    })
  }