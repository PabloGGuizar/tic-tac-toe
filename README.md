# X · O: Tic-Tac-Toe

[Read in English](README.en.md)

Un juego moderno y dinámico de Tres en Raya (Tic-Tac-Toe) desarrollado en React. No es solo un juego clásico, sino que también incluye un motor de Inteligencia Artificial capaz de analizar sus jugadas y un panel para visualizar cómo "piensa" la IA al tomar decisiones mediante el algoritmo Minimax.

## 🤖 El Algoritmo Minimax
El motor de este juego utiliza el algoritmo **Minimax**, una regla de decisión utilizada en teoría de juegos e inteligencia artificial para minimizar la posible pérdida máxima. 

En la práctica, la IA simula todas las jugadas posibles hasta el final de la partida (victoria, derrota o empate) y evalúa los resultados:
- **+10 puntos** si la IA gana.
- **-10 puntos** si el humano gana.
- **0 puntos** si hay empate.

La IA asume que el jugador humano jugará de la mejor manera posible, por lo que selecciona el movimiento que maximice su puntaje asumiendo que el rival intentará minimizarlo. Esto hace que la IA en la dificultad más alta sea matemáticamente invencible (en el peor de los casos, la partida siempre terminará en empate).

## 🚀 Características Principales
- **Inteligencia Artificial (Minimax):** Juega contra una IA invencible en dificultad difícil, o ajusta la dificultad a nivel medio o fácil.
- **Visualizador del Árbol de Decisiones:** Mira en tiempo real las jugadas posibles que la IA está evaluando y la puntuación asignada a cada movimiento.
- **Modo Oscuro / Claro:** Cambia la apariencia de la interfaz con un clic.
- **Multilingüe:** Interfaz disponible en español e inglés.
- **Reportes de Partida:** Al finalizar cada juego, visualiza un reporte detallado jugada a jugada para analizar el desarrollo de la partida.

## 💻 Cómo Ejecutar Localmente
1. Clona este repositorio en tu computadora.
2. Instala las dependencias del proyecto ejecutando `npm install`.
3. Inicia el servidor de desarrollo con `npm run dev`.
4. Abre la dirección local en tu navegador para empezar a jugar.

---
*Desarrollado por [Pablo G. Guízar](https://www.linkedin.com/in/pablogguizar/) | Licencia MIT*
