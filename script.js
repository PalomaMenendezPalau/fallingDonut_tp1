var donut = document.getElementById("donut");
var game = document.getElementById("game");
var interval;
var bothArrows = 0;
var counter = 0;
var currentBlocks = [];
var score = document.getElementById("highscore");


// Funcion para mover la dona a la izquierda usando -2 pixeles para izquierda
function moveLeft(){
    var left = parseInt(window.getComputedStyle(donut).getPropertyValue("left"));
    if(left>0){
        donut.style.left = left - 2 + "px";
    }
}

//funcion para mover la dona a la dercha y +2 pixeles para la derecha
function moveRight(){
    var left = parseInt(window.getComputedStyle(donut).getPropertyValue("left"));
    if(left<550){
        donut.style.left = left + 2 + "px";
    }
}

//Valido que las teclas que se esten tocando son las de -> o <- (llamando a la función correspondiente)
//ademas uso el bothArrows para que no se ejecute el listener si es que estoy aprentando las teclas -> y <- a la vez.
document.addEventListener("keydown", event => {
    if(bothArrows==0){
        bothArrows++;
        if(event.key==="ArrowLeft"){
            interval = setInterval(moveLeft, 1);
        }
        if(event.key==="ArrowRight"){
            interval = setInterval(moveRight, 1);
        }
    }
});

// eventListener que llamo para dejar de usar el intervalo de movimiento, basicamente para que la dona deje de moverse. 
document.addEventListener("keyup", event => {
    clearInterval(interval);
    bothArrows=0;
});

///-------------- Para crear una linea block + hole:

// funcion para que se creen los blocks y holes 
var blocks = setInterval(function(){

    //tengo que validar la posicion anterior de los blocks y holes para luego crearlos abajo
    var blockLast = document.getElementById("block"+(counter-1));
    var holeLast = document.getElementById("hole"+(counter-1));
    //valido no estar en la posicion 0 para que no intente buscar el bloque -1
    if(counter>0){
        var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
        var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }
    //validacion para que solo se creen lineas si hay lugar
    if(blockLastTop<400||counter==0){

        //creo mis elementos de block y hole y le agrego mis clases. 
        var block = document.createElement("div");
        var hole = document.createElement("div");
        block.setAttribute("class", "block");
        hole.setAttribute("class", "hole");
        //agrego el contador a los elementos para que todos tengan ids diferentes ya que estos no se pueden repetir. 
        block.setAttribute("id", "block"+counter);
        hole.setAttribute("id", "hole"+counter);
        // hago que se creen los blocks y holes 100px abajo de su posicion anterior (para luego alternar la posicion dle hole)
        block.style.top = blockLastTop + 100 + "px";
        hole.style.top = holeLastTop + 100 + "px";
        // hago que el hole sea random para que siempre varie su posicion. 
        var random = Math.floor(Math.random() * 535);
        hole.style.left = random + "px";
        // lo sumo a el area del juego 
        game.appendChild(block);
        game.appendChild(hole);
        //cada vez que creo un block lo sumo con el counter al array.
        currentBlocks.push(counter);
        counter++;
    }
    //variables para saber la posicion de la dona
    var donutTop = parseInt(window.getComputedStyle(donut).getPropertyValue("top"));
    var donutLeft = parseInt(window.getComputedStyle(donut).getPropertyValue("left"));
    var drop = 0;

    //si la posicion de la dona es mayor a 0, basicamente en donde termina el juego GAME OVER
    if(donutTop <= 0){
        alert("Game over. Score: "+(finalScore));
        clearInterval(blocks);
        location.reload();
        
    }
    //recorro mi array
    for(var i = 0; i < currentBlocks.length;i++){
        //paso mi posicion actual a una variable para pasarselas a a mis sig bloques
        let current = currentBlocks[i];
        let iblock = document.getElementById("block"+current);
        let ihole = document.getElementById("hole"+current);
        let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));
        let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));
        // calculo mi posicion restandole -0,5 para que el bloque se vaya moviendo
        iblock.style.top = iblockTop - 0.5 + "px";
        ihole.style.top = iblockTop - 0.5 + "px";
        // saco los bloques qye ya no se van a ver en mi pantalla
        if(iblockTop < -8){
            currentBlocks.shift();
            iblock.remove();
            ihole.remove();
        }
        // seteo el SCORE restandole 5 para que me de ok 
        finalScore = counter - 5;
        document.getElementById("score").innerHTML = "Score:" + finalScore;

        //si la donut esta arriba de un hole hacer que esta se caiga. 
        if(iblockTop-20<donutTop && iblockTop>donutTop){
            drop++;
            if(iholeLeft<=donutLeft && iholeLeft+20>=donutLeft){
                drop = 0;
            }
        }
    }
       //hago que la dona caiga o se mantenga en la plataforma.
    if(drop==0){
        if(donutTop < 480){
            donut.style.top = donutTop + 2 + "px";
        }
    }else{
        donut.style.top = donutTop - 0.5 + "px";
    }
    
},1);
