const boxes = document.querySelectorAll(".box");
const resetButton = document.getElementById("reset-btn");
        let currentPlayer = "X";
        let gameBoard = Array(9).fill("");
        let gameActive = true;

        function checkWinner() {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            for (let pattern of winPatterns) {
                let [a, b, c] = pattern;
                if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                    gameActive = false;
                    boxes[a].classList.add("winner");
                    boxes[b].classList.add("winner");
                    boxes[c].classList.add("winner");
                    setTimeout(() => {
                        alert(`🎉 Player ${gameBoard[a]} Wins!`);
                        resetGame();
                    }, 500);
                    return;
                }
            }
            if (!gameBoard.includes("")) {
                setTimeout(() => {
                    alert("😐 It's a Draw!");
                    resetGame();
                }, 500);
            }
        }

        function resetGame() {
            gameBoard.fill("");
            boxes.forEach(box => {
                box.textContent = "";
                box.classList.remove("x-mark", "o-mark", "winner");
            });
            currentPlayer = "X";
            gameActive = true;
        }

        boxes.forEach((box, index) => {
            box.addEventListener("click", () => {
                if (!gameBoard[index] && gameActive) {
                    gameBoard[index] = currentPlayer;
                    box.textContent = currentPlayer;
                    box.classList.add(currentPlayer === "X" ? "x-mark" : "o-mark");
                    checkWinner();
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                }
            });
        });

        resetButton.addEventListener("click", resetGame);

        function createBubble() {
            let bubble = document.createElement("div");
            bubble.classList.add("bubble");
            let randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            bubble.textContent = randomLetter;

            document.body.appendChild(bubble);
            let size = Math.random() * 30 + 10 + "px";
            bubble.style.width = size;
            bubble.style.height = size;
            bubble.style.left = Math.random() * 100 + "vw";
            bubble.style.bottom = "-10vh";

            let duration = Math.random() * 10 + 5;
            bubble.style.animation = `floatUp ${duration}s linear forwards`;

            setTimeout(() => bubble.remove(), duration * 1000);
        }

        setInterval(createBubble, 1500);