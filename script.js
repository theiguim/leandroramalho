document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".main-img", 
        { clipPath: "inset(0% 0% 0% 0%)" }, // Começa sem cortes
        { clipPath: "inset(0% 100% 0% 0%)", // Fecha dos lados para o centro sem alterar a altura
          scrollTrigger: {
              trigger: ".main-img",
              start: "top top",
              end: "bottom top",
              scrub: true,
          }
        }
    );
  
    gsap.fromTo(".main-txt", 
        { x: 0, opacity: 1 }, // Posição inicial normal
        { x: 200, opacity: 0, // Desliza para a direita (em direção à imagem) e desaparece
          scrollTrigger: {
              trigger: ".main-txt",
              start: "top top",
              end: "bottom top",
              scrub: true,
          }
        }
    );

});



document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // Define os estados iniciais
    gsap.set(".about-txt h1", { opacity: 0, x: -100 });
    gsap.set(".line", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".about-txt p", { opacity: 0, y: 30 });

    // Animação com ScrollTrigger
    gsap.timeline({
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%", // Ajuste para iniciar antes
            toggleActions: "play none none reverse",
        }
    })
    .to(".about-txt h1", { opacity: 1, x: 0, duration: 1, ease: "power2.out" })
    .to(".line", { scaleX: 1, duration: 1, ease: "power2.out" }, "-=0.5")
    .to(".about-txt p", { opacity: 1, y: 0, duration: 0.8, stagger: 0.3 }, "-=0.3");
});
