// ***********************************************
// Name: Sara Shen
//
// Program Description: This program creates a simulation of the Ising Model with 3 colors
// ***********************************************


// because there are 3 colors instead of 2, they need to be expressed as vectors
// of equal magnitude and starting from the origin
const R = new p5.Vector(1, sqrt3); 
const G = new p5.Vector(-2,0);
const B = new p5.Vector(1, -sqrt3);

// creating square grid and data table, setting the temperature T
const arr = [];
var frameMags = [];
var T = 3; 
var boxSize = 25;
var width = 600;
var height = 600;
var sqrt3 = Math.sqrt(3); 


//initializing 2D grid with random R G or B for the spins
function initialize(){
    
    for(var i = 0; i<width/boxSize; i++) {
        arr.push([]);
        for(var j=0; j<height/boxSize; j++){
            if(Math.random() < (1/3)) {
                arr[i].push(R);
            } else if (Math.random() < (2/3)) {
                arr[i].push(G);
            } else {
                arr[i].push(B);
            }
        }
    }

}



function simulation(){
    monteCarlo();
    updateScreen();
}


function monteCarlo () {

    for(c=0; c < width/boxSize*height/boxSize; c++) {
        // getting random test spins
        var i = (Math.floor(Math.random() * width/boxSize));
        var j = (Math.floor(Math.random() * height/boxSize));

        // E is the energy; Ei is initial energy
        // Ef(R,G,B) is final energy (energy if spin was flipped) to R,G, or B
        var Ei = calcE(i,j, arr[i][j]);
        var EfR = calcE(i,j, R); 
        var EfG = calcE(i,j, G);
        var EfB = calcE(i,j, B);
        var deltaE = 0;
        // delta E is change in energy 
        var r = Math.random();

        if(arr[i][j] == R) {
            //always flip to the color that lowers energy most
            if(EfG < Ei && EfG < EfB) {
                arr[i][j] = G; 
            } else if(EfB < Ei && EfB < EfG) {
                arr[i][j] = B;
            } else if(EfB == EfG && EfG < Ei) { 
                // if decrease in energy is the same, flip randomly
                Math.random() < 0.5 ? arr[i][j] = B:arr[i][j] = G;

            // sometimes flip if energy is not lowered/energy is increased
            }else if(EfG > Ei && EfG < EfB) {
                deltaE = EfG-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    arr[i][j] = G; 
                }
            } else if(EfB > Ei && EfB < EfG) {
                deltaE = EfB-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    arr[i][j] = B; 
                }
            
            // if increase in energy is the same, flip sometimes
            // and if flipped, flip randomly
            } else if(EfB == EfG) {
                deltaE = EfG-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    Math.random() < 0.5 ? arr[i][j] = G:arr[i][j] = B; 
                }
            }

        } else if(arr[i][j] == G) {
            //always flip to the color that lowers energy most
            if(EfR < Ei && EfR < EfB) {
                arr[i][j] = R; 
            } else if(EfB < Ei && EfB < EfR) {
                arr[i][j] = B;
            } else if(EfB == EfR && EfR < Ei) {
                // if decrease in energy is the same, flip randomly
                Math.random() < 0.5 ? arr[i][j] = B:arr[i][j] = R;

            // sometimes flip if energy is not lowered/energy is increased
            }else if(EfR > Ei && EfR < EfB) {
                deltaE = EfR-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    arr[i][j] = R; 
                }
            } else if(EfB > Ei && EfB < EfR) {
                deltaE = EfB-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    arr[i][j] = B; 
                }

            // if increase in energy is the same, flip sometimes
            // and if flipped, flip randomly
            } else if(EfB == EfR) {
                deltaE = EfR-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    Math.random() < 0.5 ? arr[i][j] = R:arr[i][j] = B; 
                }
            }
        } else {
            //always flip to the color that lowers energy most
            if(EfG < Ei && EfG < EfR) {
                arr[i][j] = G; 
            } else if(EfR < Ei && EfR < EfG) {
                arr[i][j] = R;
            } else if(EfR == EfG && EfG < Ei) {
                // if decrease in energy is the same, flip randomly
                Math.random() < 0.5 ? arr[i][j] = R:arr[i][j] = G;

            // sometimes flip if energy is not lowered/energy is increased
            }else if(EfR > Ei && EfG < EfR) {
                deltaE = EfR-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    arr[i][j] = R; 
                }
            } else if(EfG > Ei && EfG < EfR) {
                deltaE = EfG-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    arr[i][j] = G; 
                }

            // if increase in energy is the same, flip sometimes
            // and if flipped, flip randomly
            } else if(EfG == EfR) {
                deltaE = EfR-Ei; 
                if (r < (Math.pow(Math.E, (-deltaE/T)))){
                    Math.random() < 0.5 ? arr[i][j] = G:arr[i][j] = R; 
                }
            }
        }
    }
}

function calcE (x,y,n){
    // n is for R, B, or B to test the effects of flipping
    var total = 0; 

    // if the spin is different from the ones around it, add to the total accordingly
    // else subtract 
    if(n != arr[(x+1)%(width/boxSize)][y]){
        total++;
    } else{
        total--;
    }

    if(n != arr[(x-1 + height)%(width/boxSize)][y]) {
        total++;
    } else{
        total--;
    }
    
    if(n != arr[x][(y+1)%(height/boxSize)]){
        total++;
    } else{
        total--;
    }

    if(n != arr[x][(y-1 + height)%(height/boxSize)]){
        total++;
    } else{
        total--;
    }

    return total; 
}


function updateScreen() {
    for (let x = 0; x < width/boxSize; x++){
        for (let y = 0; y < height/boxSize; y++){
            // setting the spins' color to a shade of purple
          if (arr[x][y] == R) {
                fill(204,220,255);
            } else if (arr[x][y] == G){
                fill(179,190,255);
            } else if (arr[x][y] == B){
                fill(154,153,242); 
            }
            rect(x*boxSize, y*boxSize, boxSize, boxSize);
        }
    }
}