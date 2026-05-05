// --- LÓGICA DEL SLIDER ---
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Cambio automático cada 5 segundos
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// --- LÓGICA DEL FORMULARIO ---
document.getElementById('validar-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    
    // Aquí puedes integrar con Formspree o tu backend
    console.log("Email registrado:", email);
    
    this.innerHTML = "<h3>¡GG! Te hemos añadido a la lista. Revisa tu email.</h3>";
});

// Navbar efecto scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.padding = '10px 0';
        nav.style.background = 'rgba(10, 10, 12, 0.98)';
    } else {
        nav.style.padding = '20px 0';
    }
});