document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".main-img",
        { clipPath: "inset(0% 0% 0% 0%)" },
        {
            clipPath: "inset(0% 100% 0% 0%)",
            scrollTrigger: {
                trigger: ".main-img",
                start: "center",
                end: "bottom top",
                scrub: true,
            }
        }
    );

    gsap.fromTo(".main-txt",
        { x: 0, opacity: 1 },
        {
            x: 420, opacity: 0,
            scrollTrigger: {
                trigger: ".main-txt",
                start: "center",
                end: "bottom top",
                scrub: true,
            }
        }
    );

    gsap.fromTo(".comment",
        { x: -200, opacity: 0 }, // Começa fora da tela à esquerda
        {
            x: 0, opacity: 1, // Entra na tela
            scrollTrigger: {
                trigger: ".comment",
                start: "top 80%", // Quando 80% do elemento estiver visível
                end: "top 50%", // Animação ocorre enquanto ele percorre essa faixa
                scrub: true,
            }
        }
    );



    gsap.from(".gallery", {
        x: "-100%", // Vem da esquerda
        opacity: 0, // Começa invisível
        duration: 1.2, // Tempo da animação
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".gallery",
            start: "top 40%", // Inicia quando 80% da tela atinge o topo da section
            toggleActions: "play reverse play reverse", // Reanima ao entrar e reverte ao sair
        }
    });

    gsap.set(".about-txt h1", { opacity: 0, x: -100 });
    gsap.set(".line", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".about-txt p", { opacity: 0, y: 30 });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
            toggleActions: "play none none reverse",
        }
    })
        .to(".about-txt h1", { opacity: 1, x: 0, duration: 1, ease: "power2.out" })
        .to(".line", { scaleX: 1, duration: 1, ease: "power2.out" }, "-=0.5")
        .to(".about-txt p", { opacity: 1, y: 0, duration: 0.8, stagger: 0.3 }, "-=0.3");




    const galleryContainer = document.querySelector('.gallery-container')
    const galleryItems = document.querySelectorAll(".gallery-item")

    // Seleciona os botões criados manualmente
    const prevButton = document.getElementById("prevButton")
    const nextButton = document.getElementById("nextButton")

    class Carousel {
        constructor(container, items) {
            this.carouselContainer = container
            this.carouselArray = [...items]
        }

        updateGallery() {
            this.carouselArray.forEach(el => {
                el.classList.remove('gallery-item-1', 'gallery-item-2', 'gallery-item-3', 'gallery-item-4', 'gallery-item-5')
            })

            this.carouselArray.slice(0, 5).forEach((el, i) => {
                el.classList.add(`gallery-item-${i + 1}`)
            })
        }

        setCurrentState(direction) {
            if (direction === 'prev') {
                this.carouselArray.unshift(this.carouselArray.pop())
            } else {
                this.carouselArray.push(this.carouselArray.shift())
            }
            this.updateGallery()
        }
    }

    // Inicializa o carrossel
    const carousel = new Carousel(galleryContainer, galleryItems)

    // Adiciona eventos de clique nos botões
    prevButton.addEventListener("click", () => {
        carousel.setCurrentState("prev")
    })

    nextButton.addEventListener("click", () => {
        carousel.setCurrentState("next")
    })



    const form = document.getElementById("my-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const name = data.FNAME
        const phone = data.PHONE

        try {
            const response = await fetch("http://localhost:3000/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone }),
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
        }

        return
        try {
            const res = await fetch("http://localhost:3001/send-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Formulário enviado com sucesso!");
                window.location.href = "wpp.html";
            } else {
                alert("Erro ao enviar formulário");
            }
        } catch (err) {
            console.error("Erro:", err);
        }
    });
});



