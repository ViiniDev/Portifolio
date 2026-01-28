/* ========================================= */
/* BOTÃO SCROLL UP (INTERSECTION OBSERVER)    */
/* ========================================= */
const buttonUp = document.querySelector('.button-up');

// Cria um elemento "sentinela" no topo da página
const sentinel = document.createElement('div');
sentinel.style.height = '1px';
sentinel.style.position = 'absolute';
sentinel.style.top = '100px'; // Só aparece depois de descer 100px
sentinel.style.width = '100%';
sentinel.style.pointerEvents = 'none';
document.body.prepend(sentinel);

const observer = new IntersectionObserver(([entry]) => {
    // Se o sentinela NÃO está visível (descemos a página), mostra o botão
    if (!entry.isIntersecting) {
        buttonUp.classList.add('show');
    } else {
        buttonUp.classList.remove('show');
    }
});

observer.observe(sentinel);


/* ========================================= */
/* PROJETOS DINÂMICOS DO GITHUB               */
/* ========================================= */
const username = "ViiniDev";
const projectsContainer = document.getElementById("github-projects");

// Projetos de fallback caso a API falhe (ex: limite de requisições excedido)
const fallbackProjects = [
    {
        name: "Quartinho",
        description: "Projeto de inovação premiado no Desafio Liga Jovem SEBRAE.",
        html_url: "https://github.com/ViiniDev"
    },
    {
        name: "Portifolio",
        description: "Código fonte deste portfólio pessoal.",
        html_url: "https://github.com/ViiniDev/Portifolio"
    },
    {
        name: "Java-Spring-API",
        description: "API RESTful desenvolvida com Java e Spring Boot.",
        html_url: "https://github.com/ViiniDev"
    }
];

function renderProjects(repos) {
    projectsContainer.innerHTML = ""; // Limpa carregando

    // Filtrar projetos (Java e não fork) ou usar todos se for fallback
    const javaProjects = repos.filter(repo => 
        !repo.fork && (repo.language === 'Java' || !repo.language)
    ).slice(0, 3);

    const projectsToShow = javaProjects.length > 0 ? javaProjects : fallbackProjects;

    projectsToShow.forEach(repo => {
        const projectCard = document.createElement("div");
        projectCard.classList.add("prj-box-i");

        projectCard.innerHTML = `
            <div class="layer">
                <h5>${repo.name}</h5>
                <p>${repo.description || "Projeto backend desenvolvido em Java."}</p>
                <a class="btn_acessar" 
                   href="${repo.html_url}" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    Acessar Repositório
                </a>
            </div>
        `;

        projectsContainer.appendChild(projectCard);
    });
}

if (projectsContainer) {
    projectsContainer.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Carregando projetos...</p>";

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro API: ${response.status}`);
            }
            return response.json();
        })
        .then(repos => {
            renderProjects(repos);
        })
        .catch(error => {
            console.warn("Usando projetos de fallback devido a erro:", error);
            // Em caso de erro (limite de API, sem internet, etc), usa fallback
            renderProjects(fallbackProjects);
        });
}
