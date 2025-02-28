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
        { x: -200, opacity: 0 },
        {
            x: 0, opacity: 1, 
            scrollTrigger: {
                trigger: ".comment",
                start: "top 80%",
                end: "top 50%", 
                scrub: true,
            }
        }
    );

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

    const form = document.getElementById("my-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        alert("clicou")

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const name = data.FNAME
        const phone = data.PHONE

        // integração com MANYCHAT
        // **FAVOR VALIDAR DADOS +55
        // try {
        //     const response = await fetch("http://localhost:3000/webhook", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ name, phone }),
        //     });

        //     const data = await response.json();
        //     alert(data.message);
        // } catch (error) {
        //     console.error("Erro ao enviar formulário:", error);
        // }
        
        try {
            const res = await fetch("/api/send-form", {
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



