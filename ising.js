// ***********************************************
// Name: Sara Shen
//
// Program Description: This program creates a simulation of the Ising Model with 2 colors
// ***********************************************

// creating square grid and data table, setting the temperature T
const arr = [];
var frameMags = [];
var T = 2; 
var boxSize = 25;
var width = 600;
var height = 600;
var dataTable = new p5.Table();
dataTable.addColumn('Temperature');
dataTable.addColumn('Magnetizations');  

//initializing 2D grid with random 1 or -1 for the spins
function initialize(){
    
    for(var i = 0; i<width/boxSize; i++) {
        arr.push([]);
        for(var j=0; j<height/boxSize; j++){
            if(Math.random() < 0.5) {
                arr[i].push(-1);
            } else{
                arr[i].push(1);
            }
            
        }
    }
}


function simulation(){
    monteCarlo();
    updateScreen();
    
    // creating a data table with average magnetizations
    // the model won't run smoothly with this code uncommented, so leave it like this unless you want a graph of average magnetizations vs time

    // for (var t=6; t>0; t-=0.1){
    //     T=t; 
    //     frameMags = [];
    //     var TMavg = 0;
    //     for (var f=0; f<1000; f++) {    
    //         monteCarlo();
    //         // update lattice;
    //         updateScreen(); 
    //         if(f%10==0) {   
    //             magnet = magnetization();
    //             frameMags.push(magnet);
    //         }
    //     }
    //     TMavg = Math.abs(avgM()); 
    //     var newRow = dataTable.addRow();
    //     newRow.setString('Temperature', T); 
    //     newRow.setString('Magnetizations', TMavg);
    // }

    // saveTable(dataTable, "ising", "csv"); 

}


function monteCarlo () {

    for(c=0; c < width/boxSize*height/boxSize; c++) {
        // getting random test spins
        var i = (Math.floor(Math.random() * width/boxSize));
        var j = (Math.floor(Math.random() * height/boxSize));
        
        // E is the energy; Ei is initial energy and Ef is final energy (energy if spin was flipped)
        var Ei = calcE(i,j,1);
        var Ef = calcE(i,j,-1); 
        // change in energy from flipping the spin
        var deltaE = Ef - Ei;
        var r = Math.random();

        // always flip if energy is lowered
        // flip with small probability if energy is not lowered
        if (Ef < Ei) {
            arr[i][j] = -arr[i][j];
        } else if (r< (Math.pow(Math.E, (-deltaE/T)))) {
            arr[i][j] = -arr[i][j];
        }
    }

}

function calcE (x,y,n){
    // n is for positive or negative 1, to test the effect flipping has on E the energy
    // n=1 is not flipped, n=-1 is flipped
    var total = 0; 

    // if the spin is different from the ones around it, add to the total accordingly
    // else subtract 
    if(arr[x][y] * n != arr[(x+1)%(width/boxSize)][y]){
        total++;
    } else{
        total--;
    }

    if(arr[x][y] * n != arr[(x-1 + height)%(width/boxSize)][y]) {
        total++;
    } else{
        total--;
    }
    
    if(arr[x][y] * n != arr[x][(y+1)%(height/boxSize)]){
        total++;
    } else{
        total--;
    }

    if(arr[x][y] * n != arr[x][(y-1 + height)%(height/boxSize)]){
        total++;
    } else{
        total--;
    }
    return total; 
}


function updateScreen() {
    for (let x = 0; x < width/boxSize; x++){
        for (let y = 0; y < height/boxSize; y++){
        // setting the spins' color: 1=white, -1=black
          if (arr[x][y] > 0) {
                fill(255);
            } else {
                fill(0);
                
            } 
            rect(x*boxSize, y*boxSize, boxSize, boxSize);
        }
    } 
}


// functions magnetization() and avgM() for the data table
// calculates the magnetization of the grid
function magnetization () {
    var magT = 0;
    for(var i = 0; i<width/boxSize; i++) {
        for(var j=0; j<height/boxSize; j++){
            var elem = arr[i][j];
            magT = magT + elem
        }
    }
    return magT;
}


// calculates the average magnetization across multiple configs
function avgM(){
    var totalM = 0
    for(var f=10; f<frameMags.length; f++) {
        totalM += frameMags[f];
    }

    average = totalM/(frameMags.length - 20); 
    return average; 
}
