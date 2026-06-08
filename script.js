document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Menu Responsivo (Acessível) ---
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
        
        // Altera o estado do menu para leitores de tela
        menuToggle.setAttribute("aria-expanded", !isExpanded);
        
        // Ativa/Desativa a classe de exibição no CSS
        mainNav.classList.toggle("active");
    });

    // --- 2. Integração com API Pública (Open-Meteo) ---
    // Usando coordenadas aproximadas de uma área de preservação (ex: região da Serra da Cantareira/SP)
    const lat = "-23.41";
    const lon = "-46.62";
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    async function fetchAmbientalData() {
        const loadingElement = document.getElementById("loading-api");
        const apiCard = document.getElementById("api-card");

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Erro ao carregar dados da API");
            
            const data = await response.json();
            
            // Mapeando dados retornados pela API
            const temp = data.current_weather.temperature;
            const wind = data.current_weather.windspeed;
            const weatherCode = data.current_weather.weathercode;

            // Tradução simples de códigos meteorológicos básicos da Open-Meteo
            let condicao = "Estável";
            if (weatherCode >= 51 && weatherCode <= 67) condicao = "Chuva Leve / Moderada (Abastecendo Rios)";
            if (weatherCode >= 71 && weatherCode <= 82) condicao = "Precipitação / Clima Úmido";
            if (weatherCode >= 95) condicao = "Tempestade (Alerta de Enchentes)";

            // Atualizando o DOM com os dados recolhidos
            document.getElementById("temp-val").textContent = `${temp}°C`;
            document.getElementById("wind-val").textContent = `${wind} km/h`;
            document.getElementById("cond-val").textContent = condicao;

            // Transição visual escondendo o 'loading' e mostrando os dados
            loadingElement.classList.add("hidden");
            apiCard.classList.remove("hidden");

        } catch (error) {
            console.error("Erro:", error);
            loadingElement.textContent = "Não foi possível carregar os dados de monitoramento no momento.";
        }
    }

    // Executa a chamada da API
    fetchAmbientalData();
});